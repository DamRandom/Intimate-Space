import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Obtener la reserva
    const { data: booking, error: fetchErr } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    if (booking.status !== 'pendiente') {
      return NextResponse.json({ 
        error: `No se puede confirmar una reserva en estado ${booking.status}` 
      }, { status: 400 });
    }

    if (!booking.masajista_id) {
      return NextResponse.json({ 
        error: 'Aún no se ha asignado un masajista para esta reserva' 
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { data: updated, error: updateErr } = await supabase
      .from('reservas')
      .update({
        status: 'confirmada',
        confirmed_at: now,
        updated_at: now,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Registrar historial
    await supabase.from('reserva_historial').insert({
      reserva_id: id,
      estado_anterior: 'pendiente',
      estado_nuevo: 'confirmada',
      origen: 'cliente',
      notas: 'Cliente aceptó al masajista asignado'
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error confirmando reserva' }, { status: 500 });
  }
}
