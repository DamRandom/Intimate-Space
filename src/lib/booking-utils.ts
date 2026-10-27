/**
 * Utilidades para el manejo de reservas en Espacio Íntimo
 * Zona horaria: America/Lima (UTC-5)
 */
import { UserBooking, BookingStatus } from '@/types';

export const LIMA_TZ = 'America/Lima';

/** Mapea un time_slot legible a hora de inicio HH:MM */
export function timeSlotToHoraInicio(timeSlot: string): string | null {
  const slots: Record<string, string> = {
    'Mañana (10:00 - 14:00)': '10:00',
    'Tarde (15:00 - 19:00)':  '15:00',
    'Noche (19:00 - 22:00)':  '19:00',
    // Variantes con guión simple
    'Mañana (10:00 a 14:00)': '10:00',
    'Tarde (15:00 a 19:00)':  '15:00',
    'Noche (19:00 a 22:00)':  '19:00',
  };
  return slots[timeSlot] ?? null;
}

/** Calcula hora_fin sumando los minutos de la duración a hora_inicio */
export function calcHoraFin(horaInicio: string, duration: string): string | null {
  const match = duration.match(/(\d+)/);
  if (!match) return null;
  const mins = parseInt(match[1], 10);

  const [h, m] = horaInicio.split(':').map(Number);
  const totalMins = h * 60 + m + mins;
  const hFin = Math.floor(totalMins / 60) % 24;
  const mFin = totalMins % 60;
  return `${String(hFin).padStart(2, '0')}:${String(mFin).padStart(2, '0')}`;
}

/** Genera un ID de reserva único con formato EI-RES-XXXX */
export function generateBookingId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `EI-RES-${rand}`;
}

/** Calcula la fecha límite de confirmación (N horas después de creación) */
export function calcConfirmationDeadline(createdAt: Date, hours: number): Date {
  return new Date(createdAt.getTime() + hours * 60 * 60 * 1000);
}

/** Extrae el valor numérico del precio del string "S/ 250" */
export function parsePriceValue(priceStr: string): number {
  return parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
}

/** Convierte fila de Supabase a UserBooking del frontend */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapSupabaseRowToBooking(row: Record<string, any>): UserBooking {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userPhone: row.user_phone,
    userEmail: row.user_email,
    serviceId: row.service_id,
    serviceName: row.service_name,
    serviceTag: row.service_tag,
    duration: row.duration,
    price: row.price_display ?? `S/ ${row.price}`,
    priceValue: row.price,
    date: row.fecha ?? row.date ?? '',
    timeSlot: row.time_slot,
    horaInicio: row.hora_inicio,
    horaFin: row.hora_fin,
    notes: row.notas ?? row.notes,
    status: row.status as BookingStatus,
    masajistaId: row.masajista_id,
    therapist: row.masajista_nombre ?? row.therapist,
    confirmedAt: row.confirmed_at,
    paidAt: row.paid_at,
    completedAt: row.completed_at,
    cancelledAt: row.cancelled_at,
    confirmationDeadline: row.confirmation_deadline,
    createdAt: row.created_at,
  };
}

/** Configuración de colores/labels para cada estado */
export const STATUS_CONFIG: Record<BookingStatus, {
  label: string;
  color: string;
  bgClass: string;
  description: string;
}> = {
  pendiente: {
    label: 'Pendiente',
    color: '#f59e0b',
    bgClass: 'status-pendiente',
    description: 'Esperando selección de masajista'
  },
  confirmada: {
    label: 'Confirmada',
    color: '#10b981',
    bgClass: 'status-confirmada',
    description: 'Masajista asignado, cita agendada'
  },
  pagada: {
    label: 'Pagada',
    color: '#3b82f6',
    bgClass: 'status-pagada',
    description: 'Pago registrado por el administrador'
  },
  ocurriendo: {
    label: 'En Curso',
    color: '#8b5cf6',
    bgClass: 'status-ocurriendo',
    description: 'Masaje en curso en este momento'
  },
  por_pagar: {
    label: 'Por Pagar',
    color: '#f97316',
    bgClass: 'status-por-pagar',
    description: 'Servicio completado, pago pendiente'
  },
  completada: {
    label: 'Completada',
    color: '#6b7280',
    bgClass: 'status-completada',
    description: 'Cita finalizada y pagada'
  },
  cancelada: {
    label: 'Cancelada',
    color: '#ef4444',
    bgClass: 'status-cancelada',
    description: 'Reserva cancelada'
  },
};

/** Estados que no deben poder modificarse */
export const LOCKED_BOOKING_STATUSES: BookingStatus[] = ['completada', 'cancelada'];

/** Verifica si una reserva está bloqueada para edición */
export function isBookingLocked(status: BookingStatus): boolean {
  return LOCKED_BOOKING_STATUSES.includes(status);
}

/** Transiciones válidas que puede hacer un administrador manualmente */
export const ADMIN_ALLOWED_TRANSITIONS: Partial<Record<BookingStatus, BookingStatus[]>> = {
  pendiente:  ['confirmada', 'cancelada'],
  confirmada: ['pagada', 'cancelada'],
  pagada:     ['cancelada'],
  por_pagar:  ['completada', 'cancelada'],
  ocurriendo: ['completada', 'por_pagar'],
};

/** Devuelve los estados a los que puede transicionar manualmente el admin */
export function getAdminAllowedNextStatuses(current: BookingStatus): BookingStatus[] {
  return ADMIN_ALLOWED_TRANSITIONS[current] ?? [];
}

/** Formatea una fecha ISO a string legible en español (Lima) */
export function formatDateLima(isoDate: string, opts?: Intl.DateTimeFormatOptions): string {
  const defaults: Intl.DateTimeFormatOptions = {
    timeZone: LIMA_TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  };
  return new Date(isoDate).toLocaleString('es-PE', defaults);
}

/** Nombres de meses en español */
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function getMonthName(month: number): string {
  return MONTHS_ES[month - 1] ?? '';
}

/** Genera lista de períodos (mes, año) desde el más reciente hacia 12 meses atrás */
export function getLastNMonthPeriods(n = 12): Array<{ year: number; month: number; label: string }> {
  const periods = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`
    });
  }
  return periods;
}
