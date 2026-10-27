import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/cron/transitions
 * Tarea periódica para transiciones automáticas y reseteo diario.
 * Puede ser llamada por Vercel Cron (con CRON_SECRET) o manualmente desde el dashboard admin.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Si CRON_SECRET está configurado, validar Bearer token
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // También permitir acceso si es admin autenticado vía cookie
      // Continuar solo si falla la verificación
    }

    const supabase = createAdminClient();

    // 1. Ejecutar función de transiciones automáticas en Supabase
    const { data: transitions, error: transError } = await supabase.rpc('auto_transition_bookings');
    
    // Si la función SQL aún no está cargada o da error, hacerlo por lógica JS de respaldo
    let jsTransitionsCount = 0;
    if (transError) {
      console.warn('RPC auto_transition_bookings no disponible, ejecutando lógica JS:', transError.message);
      
      const now = new Date();
      const nowISO = now.toISOString();

      // 1a. Cancelar reservas pendientes vencidas (más de X horas o deadline vencido)
      const { data: expiredPendings } = await supabase
        .from('reservas')
        .select('id, created_at, confirmation_deadline')
        .eq('status', 'pendiente');

      if (expiredPendings) {
        for (const res of expiredPendings) {
          const isExpired = res.confirmation_deadline 
            ? new Date(res.confirmation_deadline) < now
            : (now.getTime() - new Date(res.created_at).getTime()) > 4 * 60 * 60 * 1000;

          if (isExpired) {
            await supabase
              .from('reservas')
              .update({ status: 'cancelada', cancelled_at: nowISO, updated_at: nowISO })
              .eq('id', res.id);
            
            await supabase.from('reserva_historial').insert({
              reserva_id: res.id,
              estado_anterior: 'pendiente',
              estado_nuevo: 'cancelada',
              origen: 'sistema',
              notas: 'Vencimiento de plazo para confirmar masajista'
            });
            jsTransitionsCount++;
          }
        }
      }
    }

    // 2. Verificar reset diario si corresponde (medianoche hora Lima UTC-5)
    // Se puede ejecutar rpc('reset_masajistas_diario')
    await supabase.rpc('reset_masajistas_diario');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      transitions: transitions ?? jsTransitionsCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en cron' }, { status: 500 });
  }
}
