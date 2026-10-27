/**
 * GET  /api/admin/masajistas       — Lista todos los masajistas
 * POST /api/admin/masajistas       — Crear nuevo masajista
 * Requiere autenticación admin.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const appMeta = user.app_metadata ?? {};
  return (appMeta.role === 'admin' || appMeta.claims_admin === true) ? user : null;
}

function mapMasakistaRow(row: Record<string, unknown>) {
  return {
    id:             row.id,
    nombre:         row.nombre,
    nombreDisplay:  row.nombre_display,
    whatsapp:       row.whatsapp,
    especialidades: row.especialidades ?? [],
    estado:         row.estado,
    fotoUrl:        row.foto_url,
    notas:          row.notas,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { searchParams } = new URL(request.url);
  const estadoFilter = searchParams.get('estado');

  let query = admin.from('masajistas').select('*').order('nombre');

  if (estadoFilter && estadoFilter !== 'todos') {
    query = query.eq('estado', estadoFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.warn('Advertencia consultando masajistas:', error.message);
    return NextResponse.json({ masajistas: [] });
  }

  return NextResponse.json({ masajistas: (data ?? []).map(mapMasakistaRow) });
}

export async function POST(request: NextRequest) {
  const adminUser = await verifyAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { nombre, nombreDisplay, whatsapp, especialidades, estado, notas } = body;

  if (!nombre?.trim()) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
  }

  const validEstados = ['disponible', 'ocupado', 'deshabilitado'];
  if (estado && !validEstados.includes(estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('masajistas')
    .insert({
      nombre:           nombre.trim(),
      nombre_display:   nombreDisplay?.trim() || nombre.trim(),
      whatsapp:         whatsapp?.trim() || null,
      especialidades:   especialidades ?? [],
      estado:           estado ?? 'ocupado',
      notas:            notas?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating masajista:', error);
    return NextResponse.json({ error: 'Error al crear masajista' }, { status: 500 });
  }

  return NextResponse.json({ masajista: mapMasakistaRow(data) }, { status: 201 });
}
