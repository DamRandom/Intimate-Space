-- ============================================================
-- ESPACIO ÍNTIMO — Migración Base de Datos Supabase
-- Ejecutar en el SQL Editor del dashboard de Supabase
-- ============================================================

-- ─────────────────────────────────────────
-- 1. TABLA: masajistas
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.masajistas (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre        TEXT        NOT NULL,
  nombre_display TEXT,
  whatsapp      TEXT,
  especialidades TEXT[]     DEFAULT '{}',
  estado        TEXT        NOT NULL DEFAULT 'ocupado'
                            CHECK (estado IN ('disponible', 'ocupado', 'deshabilitado')),
  foto_url      TEXT,
  notas         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 2. TABLA: reservas
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reservas (
  id                      TEXT        PRIMARY KEY,
  user_id                 UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name               TEXT        NOT NULL,
  user_phone              TEXT        NOT NULL,
  user_email              TEXT,
  service_id              TEXT        NOT NULL,
  service_name            TEXT        NOT NULL,
  service_tag             TEXT,
  duration                TEXT        NOT NULL,
  price                   NUMERIC     NOT NULL DEFAULT 0,
  price_display           TEXT,
  fecha                   DATE,
  time_slot               TEXT        NOT NULL,
  hora_inicio             TIME,
  hora_fin                TIME,
  notas                   TEXT,
  status                  TEXT        NOT NULL DEFAULT 'pendiente'
                                      CHECK (status IN (
                                        'pendiente','confirmada','pagada',
                                        'ocurriendo','por_pagar','completada','cancelada'
                                      )),
  masajista_id            UUID        REFERENCES public.masajistas(id) ON DELETE SET NULL,
  masajista_nombre        TEXT,
  confirmed_at            TIMESTAMPTZ,
  paid_at                 TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ,
  cancelled_at            TIMESTAMPTZ,
  confirmation_deadline   TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 3. TABLA: reserva_historial
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reserva_historial (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id      TEXT        REFERENCES public.reservas(id) ON DELETE CASCADE,
  estado_anterior TEXT,
  estado_nuevo    TEXT        NOT NULL,
  origen          TEXT        NOT NULL DEFAULT 'sistema'
                              CHECK (origen IN ('admin', 'cliente', 'sistema')),
  notas           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 4. TABLA: config_sistema
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.config_sistema (
  clave       TEXT        PRIMARY KEY,
  valor       TEXT        NOT NULL,
  descripcion TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.config_sistema (clave, valor, descripcion) VALUES
  ('confirmation_deadline_hours', '4', 'Horas para que el cliente confirme su masajista desde que se crea la reserva'),
  ('timezone', 'America/Lima', 'Zona horaria del negocio'),
  ('stats_retention_months', '12', 'Meses máximos de historial de estadísticas a retener')
ON CONFLICT (clave) DO NOTHING;

-- ─────────────────────────────────────────
-- 5. DATOS INICIALES: masajistas
-- ─────────────────────────────────────────
INSERT INTO public.masajistas (nombre, nombre_display, especialidades, estado) VALUES
  ('Alejandro R.',  'Alejandro', ARRAY['Ritual INTI', 'Terapéutico'], 'disponible'),
  ('Carlos M.',     'Carlos',    ARRAY['Aromaterapia', 'Relajación'],  'disponible'),
  ('Mateo S.',      'Mateo',     ARRAY['Descontracturante', 'Deportivo'], 'disponible'),
  ('Rodrigo D.',    'Rodrigo',   ARRAY['Dúo Ceremonial', 'Sensorial'], 'disponible')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- 6. FUNCIÓN: updated_at automático
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER masajistas_updated_at
  BEFORE UPDATE ON public.masajistas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER reservas_updated_at
  BEFORE UPDATE ON public.reservas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─────────────────────────────────────────
-- 7. FUNCIÓN: transiciones automáticas de reservas
-- Llamada por Vercel Cron cada minuto
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.auto_transition_reservas()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  tz TEXT := 'America/Lima';
  now_local TIMESTAMPTZ := NOW() AT TIME ZONE tz;
  affected_rows INT := 0;
  transitioned JSONB := '[]'::JSONB;
  rec RECORD;
BEGIN
  -- Transición: pendiente → cancelada (venció el plazo de confirmación)
  FOR rec IN
    SELECT id, status FROM public.reservas
    WHERE status = 'pendiente'
      AND confirmation_deadline IS NOT NULL
      AND confirmation_deadline < NOW()
  LOOP
    UPDATE public.reservas
    SET status = 'cancelada', cancelled_at = NOW()
    WHERE id = rec.id;

    INSERT INTO public.reserva_historial (reserva_id, estado_anterior, estado_nuevo, origen)
    VALUES (rec.id, 'pendiente', 'cancelada', 'sistema');

    transitioned := transitioned || jsonb_build_object('id', rec.id, 'from', 'pendiente', 'to', 'cancelada');
    affected_rows := affected_rows + 1;
  END LOOP;

  -- Transición: confirmada/pagada → ocurriendo (ha llegado la hora de inicio)
  FOR rec IN
    SELECT r.id, r.status, r.paid_at FROM public.reservas r
    WHERE r.status IN ('confirmada', 'pagada')
      AND r.fecha IS NOT NULL
      AND r.hora_inicio IS NOT NULL
      AND r.hora_fin IS NOT NULL
      AND (r.fecha + r.hora_inicio) AT TIME ZONE tz <= NOW()
      AND (r.fecha + r.hora_fin) AT TIME ZONE tz > NOW()
  LOOP
    UPDATE public.reservas
    SET status = 'ocurriendo'
    WHERE id = rec.id;

    INSERT INTO public.reserva_historial (reserva_id, estado_anterior, estado_nuevo, origen)
    VALUES (rec.id, rec.status, 'ocurriendo', 'sistema');

    transitioned := transitioned || jsonb_build_object('id', rec.id, 'from', rec.status, 'to', 'ocurriendo');
    affected_rows := affected_rows + 1;
  END LOOP;

  -- Transición: ocurriendo → completada o por_pagar (ha finalizado la hora)
  FOR rec IN
    SELECT r.id, r.status, r.paid_at FROM public.reservas r
    WHERE r.status = 'ocurriendo'
      AND r.fecha IS NOT NULL
      AND r.hora_fin IS NOT NULL
      AND (r.fecha + r.hora_fin) AT TIME ZONE tz <= NOW()
  LOOP
    IF rec.paid_at IS NOT NULL THEN
      UPDATE public.reservas
      SET status = 'completada', completed_at = NOW()
      WHERE id = rec.id;

      INSERT INTO public.reserva_historial (reserva_id, estado_anterior, estado_nuevo, origen)
      VALUES (rec.id, 'ocurriendo', 'completada', 'sistema');

      transitioned := transitioned || jsonb_build_object('id', rec.id, 'from', 'ocurriendo', 'to', 'completada');
    ELSE
      UPDATE public.reservas
      SET status = 'por_pagar'
      WHERE id = rec.id;

      INSERT INTO public.reserva_historial (reserva_id, estado_anterior, estado_nuevo, origen)
      VALUES (rec.id, 'ocurriendo', 'por_pagar', 'sistema');

      transitioned := transitioned || jsonb_build_object('id', rec.id, 'from', 'ocurriendo', 'to', 'por_pagar');
    END IF;

    affected_rows := affected_rows + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'affected', affected_rows,
    'transitions', transitioned,
    'executed_at', NOW()
  );
END;
$$;

-- ─────────────────────────────────────────
-- 8. FUNCIÓN: reset diario de disponibilidad de masajistas
-- Llamada por Vercel Cron a las 00:00 hora Lima
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reset_masajistas_diario()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  affected_rows INT;
BEGIN
  UPDATE public.masajistas
  SET estado = 'ocupado', updated_at = NOW()
  WHERE estado = 'disponible';

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  RETURN jsonb_build_object(
    'reset_count', affected_rows,
    'executed_at', NOW()
  );
END;
$$;

-- ─────────────────────────────────────────
-- 9. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

-- Habilitar RLS en todas las tablas
ALTER TABLE public.masajistas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserva_historial  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config_sistema     ENABLE ROW LEVEL SECURITY;

-- Función helper para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'claims_admin')::BOOLEAN = TRUE,
    FALSE
  )
$$;

-- MASAJISTAS: admins CRUD, usuarios solo ven disponibles, anon puede ver disponibles
DROP POLICY IF EXISTS "masajistas_admin_all"   ON public.masajistas;
DROP POLICY IF EXISTS "masajistas_public_read" ON public.masajistas;

CREATE POLICY "masajistas_admin_all" ON public.masajistas
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "masajistas_public_read" ON public.masajistas
  FOR SELECT TO anon, authenticated
  USING (estado = 'disponible');

-- RESERVAS: admins ven todas; usuarios autenticados ven las suyas
DROP POLICY IF EXISTS "reservas_admin_all"  ON public.reservas;
DROP POLICY IF EXISTS "reservas_owner_crud" ON public.reservas;

CREATE POLICY "reservas_admin_all" ON public.reservas
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "reservas_owner_crud" ON public.reservas
  FOR ALL TO authenticated
  USING (auth.uid() = user_id AND NOT public.is_admin())
  WITH CHECK (auth.uid() = user_id AND NOT public.is_admin());

-- HISTORIAL: solo admins
DROP POLICY IF EXISTS "historial_admin_all" ON public.reserva_historial;

CREATE POLICY "historial_admin_all" ON public.reserva_historial
  FOR ALL TO authenticated
  USING (public.is_admin());

-- CONFIG: solo admins
DROP POLICY IF EXISTS "config_admin_all" ON public.config_sistema;

CREATE POLICY "config_admin_all" ON public.config_sistema
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─────────────────────────────────────────
-- 10. ÍNDICES para performance
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reservas_status      ON public.reservas(status);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha       ON public.reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_user_id     ON public.reservas(user_id);
CREATE INDEX IF NOT EXISTS idx_reservas_masajista   ON public.reservas(masajista_id);
CREATE INDEX IF NOT EXISTS idx_historial_reserva_id ON public.reserva_historial(reserva_id);
CREATE INDEX IF NOT EXISTS idx_reservas_created_at  ON public.reservas(created_at);

-- ─────────────────────────────────────────
-- FIN DE LA MIGRACIÓN
-- ─────────────────────────────────────────
-- PRÓXIMO PASO: 
-- 1. Añade SUPABASE_SERVICE_ROLE_KEY a tu .env.local 
--    (la encuentras en Supabase Dashboard → Settings → API → service_role)
-- 2. Añade también a Vercel Environment Variables
-- ─────────────────────────────────────────
