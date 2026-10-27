/**
 * GET /api/admin/stats?year=2026&month=10
 * Devuelve estadísticas del período seleccionado para el dashboard admin.
 * Requiere autenticación con rol admin.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { StatsKPI, MonthlyDataPoint } from '@/types';

export async function GET(request: NextRequest) {
  // 1. Verificar autenticación y rol admin
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const appMeta = user.app_metadata ?? {};
  const isAdmin = appMeta.role === 'admin' || appMeta.claims_admin === true;
  if (!isAdmin) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  // 2. Parsear período
  const { searchParams } = new URL(request.url);
  const year  = parseInt(searchParams.get('year')  ?? String(new Date().getFullYear()), 10);
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1), 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: 'Período inválido' }, { status: 400 });
  }

  const admin = createAdminClient();

  // 3. Rango de fechas del mes seleccionado
  const fechaDesde = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const fechaHasta = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  // 4. Consultar reservas del período
  let rows: any[] = [];
  try {
    const { data: reservas, error: reservasError } = await admin
      .from('reservas')
      .select('id, user_id, status, price, masajista_nombre, masajista_id, service_name, service_id, fecha, created_at, paid_at')
      .gte('fecha', fechaDesde)
      .lte('fecha', fechaHasta);

    if (reservasError) {
      console.warn('Advertencia en reservas stats (posiblemente tabla aún no creada):', reservasError.message);
    } else if (reservas) {
      rows = reservas;
    }
  } catch (err: any) {
    console.warn('Error consultando reservas:', err.message);
  }


  // 5. Calcular KPIs
  const totalCitas = rows.length;
  const clientesUnicos = new Set(rows.map(r => r.user_id).filter(Boolean)).size;

  const byStatus = {
    pendiente:  rows.filter(r => r.status === 'pendiente').length,
    confirmada: rows.filter(r => r.status === 'confirmada').length,
    pagada:     rows.filter(r => r.status === 'pagada').length,
    ocurriendo: rows.filter(r => r.status === 'ocurriendo').length,
    por_pagar:  rows.filter(r => r.status === 'por_pagar').length,
    completada: rows.filter(r => r.status === 'completada').length,
    cancelada:  rows.filter(r => r.status === 'cancelada').length,
  };

  // Ingresos efectivos: completada + pagada (ya cobradas)
  const ingresosEfectivos = rows
    .filter(r => r.status === 'completada' || r.status === 'pagada')
    .reduce((acc, r) => acc + (Number(r.price) || 0), 0);

  // Ingresos pendientes: por_pagar
  const ingresosPendientes = rows
    .filter(r => r.status === 'por_pagar')
    .reduce((acc, r) => acc + (Number(r.price) || 0), 0);

  // Tasa de cancelación
  const tasaCancelacion = totalCitas > 0
    ? Math.round((byStatus.cancelada / totalCitas) * 100)
    : 0;

  // Masajista más activo
  const masajistaCount: Record<string, { nombre: string; count: number }> = {};
  rows.forEach(r => {
    if (r.masajista_id && r.masajista_nombre) {
      if (!masajistaCount[r.masajista_id]) {
        masajistaCount[r.masajista_id] = { nombre: r.masajista_nombre, count: 0 };
      }
      masajistaCount[r.masajista_id].count++;
    }
  });
  const masajistaTop = Object.entries(masajistaCount)
    .sort((a, b) => b[1].count - a[1].count)[0];

  // Servicio más solicitado
  const servicioCount: Record<string, { nombre: string; count: number }> = {};
  rows.forEach(r => {
    if (r.service_id && r.service_name) {
      if (!servicioCount[r.service_id]) {
        servicioCount[r.service_id] = { nombre: r.service_name, count: 0 };
      }
      servicioCount[r.service_id].count++;
    }
  });
  const servicioTop = Object.entries(servicioCount)
    .sort((a, b) => b[1].count - a[1].count)[0];

  const kpi: StatsKPI = {
    totalCitas,
    clientesAtendidos: clientesUnicos,
    ingresosEfectivos,
    ingresosPendientes,
    citasPendientes:  byStatus.pendiente,
    citasConfirmadas: byStatus.confirmada,
    citasPagadas:     byStatus.pagada,
    citasOcurriendo:  byStatus.ocurriendo,
    citasPorPagar:    byStatus.por_pagar,
    citasCompletadas: byStatus.completada,
    citasCanceladas:  byStatus.cancelada,
    tasaCancelacion,
    masajistaTopId:     masajistaTop?.[0],
    masajistaTopNombre: masajistaTop?.[1].nombre,
    masajistaTopCitas:  masajistaTop?.[1].count,
    servicioTopId:      servicioTop?.[0],
    servicioTopNombre:  servicioTop?.[1].nombre,
    servicioTopCitas:   servicioTop?.[1].count,
  };

  // 6. Evolución mensual (últimos 6 meses)
  let monthlyRaw: any[] = [];
  try {
    const { data: mData } = await admin
      .from('reservas')
      .select('fecha, status, price')
      .gte('fecha', (() => {
        const d = new Date(year, month - 1 - 5, 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      })())
      .lte('fecha', fechaHasta);
    if (mData) monthlyRaw = mData;
  } catch (err: any) {
    console.warn('Error consultando evolución mensual:', err.message);
  }


  const monthlyMap: Record<string, MonthlyDataPoint> = {};
  const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  ((monthlyRaw as any[]) ?? []).forEach((r: any) => {
    if (!r.fecha) return;
    const d = new Date(r.fecha);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        mes: `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`,
        citas: 0, ingresos: 0, cancelaciones: 0
      };
    }
    monthlyMap[key].citas++;
    if (r.status === 'completada' || r.status === 'pagada') {
      monthlyMap[key].ingresos += Number(r.price) || 0;
    }
    if (r.status === 'cancelada') {
      monthlyMap[key].cancelaciones++;
    }
  });

  const monthlyTrend: MonthlyDataPoint[] = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);

  // 7. Distribución de servicios para gráfico
  const serviceDistribution = Object.entries(servicioCount)
    .map(([id, v]) => ({ serviceId: id, serviceName: v.nombre, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // 8. Distribución de estados para pie chart
  const statusDistribution = Object.entries(byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ status, count }));

  return NextResponse.json({
    period: { year, month, fechaDesde, fechaHasta },
    kpi,
    monthlyTrend,
    serviceDistribution,
    statusDistribution,
  });
}
