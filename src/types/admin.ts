/** Masajista — tipo para la tabla `masajistas` de Supabase */
export interface Masajista {
  id: string;
  nombre: string;
  nombreDisplay?: string;
  whatsapp?: string;
  especialidades: string[];
  estado: MasakistaEstado;
  fotoUrl?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export type MasakistaEstado = 'disponible' | 'ocupado' | 'deshabilitado';

/** Estado de color/label para los badges */
export interface StatusConfig {
  label: string;
  color: string;       // CSS class suffix o hex
  bgClass: string;
  textClass: string;
  icon?: string;
}

/** Configuración del sistema */
export interface ConfigSistema {
  clave: string;
  valor: string;
  descripcion?: string;
  updatedAt: string;
}

/** KPI para el dashboard de estadísticas */
export interface StatsKPI {
  totalCitas: number;
  clientesAtendidos: number;
  ingresosEfectivos: number;   // completada + pagada
  ingresosPendientes: number;  // por_pagar
  citasPendientes: number;
  citasConfirmadas: number;
  citasPagadas: number;
  citasOcurriendo: number;
  citasPorPagar: number;
  citasCompletadas: number;
  citasCanceladas: number;
  tasaCancelacion: number;     // 0-100 (%)
  masajistaTopId?: string;
  masajistaTopNombre?: string;
  masajistaTopCitas?: number;
  servicioTopId?: string;
  servicioTopNombre?: string;
  servicioTopCitas?: number;
}

/** Punto de datos para gráficos de evolución mensual */
export interface MonthlyDataPoint {
  mes: string;        // "Oct 2026"
  citas: number;
  ingresos: number;
  cancelaciones: number;
}

/** Filtros de período para estadísticas */
export interface StatsPeriod {
  year: number;
  month: number;      // 1-12
}

/** Filtros de búsqueda de reservas para admin */
export interface BookingFilters {
  search?: string;
  status?: string;
  masajistaId?: string;
  serviceId?: string;
  fechaDesde?: string;  // YYYY-MM-DD
  fechaHasta?: string;
  page?: number;
  perPage?: number;
}

/** Historial de cambio de estado */
export interface ReservaHistorial {
  id: string;
  reservaId: string;
  estadoAnterior?: string;
  estadoNuevo: string;
  origen: 'admin' | 'cliente' | 'sistema';
  notas?: string;
  createdAt: string;
}

export interface StatsResponse {
  period: { year: number; month: number; fechaDesde: string; fechaHasta: string };
  kpi: StatsKPI;
  monthlyTrend: MonthlyDataPoint[];
  serviceDistribution: Array<{ serviceId: string; serviceName: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
}

