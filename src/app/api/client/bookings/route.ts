import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { mapSupabaseRowToBooking } from '@/lib/booking-utils';

export async function POST(request: NextRequest) {
  try {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    const body = await request.json();
    const {
      serviceId,
      serviceName,
      serviceTag,
      duration,
      price,
      priceDisplay,
      date,
      timeSlot,
      userName,
      userPhone,
      userEmail,
      notes,
    } = body;

    if (!serviceName || !userName || !userPhone || !timeSlot) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const bookingId = `EI-RES-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const admin = createAdminClient();

    // Parse price
    const numericPrice = typeof price === 'number' 
      ? price 
      : parseFloat(String(price || '').replace(/[^\d.]/g, '') || '0');

    // Deadline 4 horas por defecto
    const deadline = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();

    const { data, error } = await admin
      .from('reservas')
      .insert({
        id: bookingId,
        user_id: user?.id || null,
        user_name: userName,
        user_phone: userPhone,
        user_email: userEmail || user?.email || null,
        service_id: serviceId || 'custom',
        service_name: serviceName,
        service_tag: serviceTag || null,
        duration: duration || '60 min',
        price: numericPrice,
        price_display: priceDisplay || `S/ ${numericPrice}`,
        fecha: date || null,
        time_slot: timeSlot,
        notas: notes || null,
        status: 'pendiente',
        confirmation_deadline: deadline,
      })
      .select()
      .single();

    if (error) {
      console.error('Error insertando reserva en Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Registrar en historial
    await admin.from('reserva_historial').insert({
      reserva_id: bookingId,
      estado_anterior: null,
      estado_nuevo: 'pendiente',
      origen: 'cliente',
      notas: 'Reserva creada por el cliente'
    });

    return NextResponse.json({
      success: true,
      booking: mapSupabaseRowToBooking(data)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al procesar reserva' }, { status: 500 });
  }
}
