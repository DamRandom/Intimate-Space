export type UserRole = 'client' | 'admin';

export type MembershipTier = 'standard' | 'vip' | 'black_label';

/** 7 estados del ciclo de vida de una reserva */
export type BookingStatus =
  | 'pendiente'
  | 'confirmada'
  | 'pagada'
  | 'ocurriendo'
  | 'por_pagar'
  | 'completada'
  | 'cancelada';

/** Estados que bloquean edición/eliminación */
export const LOCKED_STATUSES: BookingStatus[] = ['completada', 'cancelada'];

/** Estados terminales (no pueden cambiar automáticamente) */
export const TERMINAL_STATUSES: BookingStatus[] = ['completada', 'cancelada'];

export interface UserPreferences {
  aroma?: string;
  pressure?: 'suave' | 'media' | 'firme' | 'profunda';
  beverage?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email?: string;
  phone: string;
  role: UserRole;
  membershipTier: MembershipTier;
  memberCode: string;
  preferences?: UserPreferences;
  createdAt: string;
  avatarUrl?: string;
}

/** Reserva tal como viene de Supabase */
export interface UserBooking {
  id: string;
  userId?: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  serviceId: string;
  serviceName: string;
  serviceTag?: string;
  duration: string;
  price: string;        // display: "S/ 250"
  priceValue?: number;  // numérico para cálculos
  date: string;
  timeSlot: string;
  horaInicio?: string;  // HH:MM
  horaFin?: string;     // HH:MM
  notes?: string;
  status: BookingStatus;
  masajistaId?: string;
  therapist?: string;   // nombre display del masajista
  confirmedAt?: string;
  paidAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  confirmationDeadline?: string;
  createdAt: string;
}

