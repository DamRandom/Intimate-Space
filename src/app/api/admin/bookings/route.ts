/**
 * GET  /api/admin/bookings  — Lista de reservas con filtros
 * Requiere autenticación admin.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { mapSupabaseRowToBooking } from '@/lib/booking-utils';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const appMeta = user.app_metadata ?? {};
  const isAdmin = appMeta.role === 'admin' || appMeta.claims_admin === true;
  return isAdmin ? user : null;
}

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search     = searchParams.get('search')      ?? '';
  const status     = searchParams.get('status')      ?? '';
  const masajista  = searchParams.get('masajista_id') ?? '';
  const serviceId  = searchParams.get('service_id')  ?? '';
  const fechaDesde = searchParams.get('fecha_desde') ?? '';
  const fechaHasta = searchParams.get('fecha_hasta') ?? '';
  const page       = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const perPage    = Math.min(100, parseInt(searchParams.get('per_page') ?? '50', 10));

  const admin = createAdminClient();
  let query = admin.from('reservas').select('*', { count: 'exact' });

  // Filtros
  if (status && status !== 'todas') {
    query = query.eq('status', status);
  }
  if (masajista) {
    query = query.eq('masajista_id', masajista);
  }
  if (serviceId) {
    query = query.eq('service_id', serviceId);
  }
  if (fechaDesde) {
    query = query.gte('fecha', fechaDesde);
  }
  if (fechaHasta) {
    query = query.lte('fecha', fechaHasta);
  }
  if (search) {
    // Búsqueda por nombre, teléfono, email o ID
    query = query.or(
      `user_name.ilike.%${search}%,user_phone.ilike.%${search}%,user_email.ilike.%${search}%,id.ilike.%${search}%,service_name.ilike.%${search}%`
    );
  }

  // Orden y paginación
  const from = (page - 1) * perPage;
  const to   = from + perPage - 1;
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.warn('Advertencia consultando reservas:', error.message);
    return NextResponse.json({
      bookings: [],
      pagination: { total: 0, page, perPage, totalPages: 0 }
    });
  }

  const bookings = (data ?? []).map(mapSupabaseRowToBooking);

  return NextResponse.json({
    bookings,
    pagination: {
      total: count ?? 0,
      page,
      perPage,
      totalPages: Math.ceil((count ?? 0) / perPage),
    }
  });
}
