export type UserRole = 'client' | 'admin';

export type MembershipTier = 'standard' | 'vip' | 'black_label';

export type BookingStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface UserPreferences {
  aroma?: string;
  pressure?: 'suave' | 'media' | 'firme' | 'profunda';
  beverage?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  membershipTier: MembershipTier;
  memberCode: string;
  preferences?: UserPreferences;
  createdAt: string;
  avatarUrl?: string;
}

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
  price: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: BookingStatus;
  therapist?: string;
  createdAt: string;
}
