/**
 * PATCH /api/admin/bookings/[id]  — Actualizar estado o masajista de una reserva
 * DELETE /api/admin/bookings/[id] — NO permitido para completadas/canceladas
 * Requiere autenticación admin.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { BookingStatus } from '@/types';
import {
  isBookingLocked,
  getAdminAllowedNextStatuses,
  mapSupabaseRowToBooking
} from '@/lib/booking-utils';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const appMeta = user.app_metadata ?? {};
  return (appMeta.role === 'admin' || appMeta.claims_admin === true) ? user : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await verifyAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'ID de reserva requerido' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const { status: newStatus, masajistaId, notas } = body;

  const admin = createAdminClient();

  // Obtener reserva actual
  const { data: current, error: fetchError } = await admin
    .from('reservas')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
  }

  // Verificar si está bloqueada
  if (isBookingLocked(current.status as BookingStatus)) {
    return NextResponse.json(
      { error: `La reserva ${id} está ${current.status} y no puede modificarse.` },
      { status: 409 }
    );
  }

  const updates: Record<string, unknown> = {};
  const historialEntry: Record<string, unknown> = {
    reserva_id:     id,
    estado_anterior: current.status,
    origen:         'admin',
    notas,
  };

  // Actualización de estado
  if (newStatus && newStatus !== current.status) {
    const allowedNextStatuses = getAdminAllowedNextStatuses(current.status as BookingStatus);

    if (!allowedNextStatuses.includes(newStatus as BookingStatus)) {
      return NextResponse.json(
        { error: `Transición de estado inválida: ${current.status} → ${newStatus}` },
        { status: 422 }
      );
    }

    updates.status = newStatus;
    historialEntry.estado_nuevo = newStatus;

    // Timestamps según nuevo estado
    if (newStatus === 'confirmada') updates.confirmed_at = new Date().toISOString();
    if (newStatus === 'pagada')     updates.paid_at = new Date().toISOString();
    if (newStatus === 'completada') updates.completed_at = new Date().toISOString();
    if (newStatus === 'cancelada')  updates.cancelled_at = new Date().toISOString();
  }

  // Asignación de masajista
  if (masajistaId !== undefined) {
    if (masajistaId === null || masajistaId === '') {
      updates.masajista_id = null;
      updates.masajista_nombre = null;
    } else {
      // Verificar que el masajista existe y está disponible
      const { data: masajista, error: mError } = await admin
        .from('masajistas')
        .select('id, nombre, estado')
        .eq('id', masajistaId)
        .single();

      if (mError || !masajista) {
        return NextResponse.json({ error: 'Masajista no encontrado' }, { status: 404 });
      }

      if (masajista.estado === 'deshabilitado') {
        return NextResponse.json(
          { error: 'El masajista seleccionado está deshabilitado' },
          { status: 409 }
        );
      }

      // Verificar conflictos de horario
      if (current.fecha && current.hora_inicio && current.hora_fin) {
        const { data: conflicts } = await admin
          .from('reservas')
          .select('id, status')
          .eq('masajista_id', masajistaId)
          .eq('fecha', current.fecha)
          .in('status', ['confirmada', 'pagada', 'ocurriendo'])
          .neq('id', id)
          .lt('hora_inicio', current.hora_fin)
          .gt('hora_fin', current.hora_inicio);

        if (conflicts && conflicts.length > 0) {
          return NextResponse.json(
            { error: `El masajista tiene ${conflicts.length} conflicto(s) de horario en esta fecha.` },
            { status: 409 }
          );
        }
      }

      updates.masajista_id = masajistaId;
      updates.masajista_nombre = masajista.nombre;
    }

    // Si asignamos masajista y estaba pendiente, podemos auto-confirmar si el admin quiere
    if (masajistaId && current.status === 'pendiente' && !newStatus) {
      updates.status = 'confirmada';
      updates.confirmed_at = new Date().toISOString();
      historialEntry.estado_nuevo = 'confirmada';
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No hay cambios que aplicar' }, { status: 400 });
  }

  // Aplicar actualización
  const { data: updated, error: updateError } = await admin
    .from('reservas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (updateError || !updated) {
    console.error('Error updating booking:', updateError);
    return NextResponse.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
  }

  // Registrar en historial si hubo cambio de estado
  if (historialEntry.estado_nuevo) {
    await admin.from('reserva_historial').insert(historialEntry);
  }

  return NextResponse.json({ booking: mapSupabaseRowToBooking(updated) });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await verifyAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: current } = await admin
    .from('reservas')
    .select('status')
    .eq('id', id)
    .single();

  if (!current) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
  }

  // Bloquear eliminación de completadas/canceladas desde el flujo normal
  if (isBookingLocked(current.status as BookingStatus)) {
    return NextResponse.json(
      { error: `Las reservas ${current.status}s no pueden eliminarse.` },
      { status: 409 }
    );
  }

  const { error: deleteError } = await admin
    .from('reservas')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: 'Error al eliminar la reserva' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
