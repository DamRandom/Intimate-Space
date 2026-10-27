'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserBooking, 
  UserPreferences, 
  BookingStatus,
  UserRole,
  MembershipTier
} from '@/types';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  bookings: UserBooking[];
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  register: (name: string, lastName: string, username: string, phone: string, password: string, email?: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void> | void;
  updatePreferences: (preferences: UserPreferences) => Promise<void> | void;
  createBooking: (booking: Omit<UserBooking, 'id' | 'createdAt' | 'status'>) => UserBooking;
  updateBookingStatus: (id: string, status: BookingStatus, therapist?: string) => void;
  cancelBooking: (id: string) => void;
  getUserBookings: () => UserBooking[];
}

const STORAGE_KEY_BOOKINGS_DB = 'espacio_intimo_all_bookings';

// Seed demo bookings for mock business data (no plain-text passwords or mock users)
const SEED_BOOKINGS: UserBooking[] = [
  {
    id: 'EI-RES-1049',
    userId: 'user-client-1',
    userName: 'Sebastián Valdivia',
    userPhone: '+51 987 654 321',
    userEmail: 'cliente@espaciointimo.pe',
    serviceId: 'inti-sensorial',
    serviceName: 'Ritual INTI Sensorial',
    serviceTag: 'Firma de la Casa',
    duration: '90 min',
    price: 'S/ 250',
    date: '2026-10-25',
    timeSlot: 'Tarde (15:00 a 19:00)',
    notes: 'Solicita cabina con aroma a madera de cedro.',
    status: 'confirmada',
    therapist: 'Alejandro R.',
    createdAt: '2026-10-22T14:30:00Z'
  },
  {
    id: 'EI-RES-1048',
    userId: 'user-client-1',
    userName: 'Sebastián Valdivia',
    userPhone: '+51 987 654 321',
    userEmail: 'cliente@espaciointimo.pe',
    serviceId: 'descontracturante-profundo',
    serviceName: 'Masaje Descontracturante Profundo',
    serviceTag: 'Terapéutico',
    duration: '60 min',
    price: 'S/ 190',
    date: '2026-10-28',
    timeSlot: 'Noche (19:00 a 22:00)',
    notes: 'Alivio post entrenamiento deportivo.',
    status: 'pendiente',
    createdAt: '2026-10-23T02:00:00Z'
  },
  {
    id: 'EI-RES-1042',
    userId: 'user-client-2',
    userName: 'Rodrigo Pezet',
    userPhone: '+51 993 112 450',
    userEmail: 'rpezet@luxuryperu.com',
    serviceId: 'masaje-relajante-aromaterapia',
    serviceName: 'Relajación con Aromaterapia Botánica',
    serviceTag: 'Bienestar',
    duration: '90 min',
    price: 'S/ 220',
    date: '2026-10-20',
    timeSlot: 'Mañana (10:00 a 14:00)',
    notes: 'Cliente habitual, atención especial.',
    status: 'completada',
    therapist: 'Carlos M.',
    createdAt: '2026-10-18T10:15:00Z'
  }
];

// Helper to safely map a Supabase User to the internal UserProfile
function mapSupabaseUserToProfile(supabaseUser: SupabaseUser): UserProfile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = (supabaseUser.user_metadata || {}) as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appMeta = (supabaseUser.app_metadata || {}) as Record<string, any>;

  // CRITICAL SECURITY RULE: The admin role must NEVER be derived from client-editable
  // user_metadata, email, username or localStorage. It is strictly validated against
  // server-managed claims in app_metadata.
  const role: UserRole =
    appMeta.role === 'admin' || appMeta.claims_admin === true
      ? 'admin'
      : 'client';

  const tier: MembershipTier =
    meta.membershipTier === 'black_label'
      ? 'black_label'
      : meta.membershipTier === 'vip'
      ? 'vip'
      : 'standard';

  const rawName = meta.name || meta.full_name || supabaseUser.email?.split('@')[0] || 'Socio';
  const lastName = meta.lastName || meta.last_name || '';
  const username = meta.username || supabaseUser.email?.split('@')[0] || 'socio';
  const phone = meta.phone || supabaseUser.phone || '';
  const memberCode = meta.memberCode || `EI-${supabaseUser.id.substring(0, 6).toUpperCase()}`;

  return {
    id: supabaseUser.id,
    name: rawName,
    lastName,
    username,
    email: supabaseUser.email || '',
    phone,
    role,
    membershipTier: tier,
    memberCode,
    preferences: meta.preferences || {
      aroma: 'Eucalipto & Cedro Silvestre',
      pressure: 'firme',
      beverage: 'Infusión de Menta Andina',
      notes: ''
    },
    createdAt: supabaseUser.created_at || new Date().toISOString()
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from Supabase Auth and subscribe to state changes
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    // Clean up any legacy mock credentials from localStorage to avoid storing passwords
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('espacio_intimo_registered_users');
        localStorage.removeItem('espacio_intimo_current_user');

        // Bookings store initialization
        const storedBookings = localStorage.getItem(STORAGE_KEY_BOOKINGS_DB);
        if (!storedBookings) {
          localStorage.setItem(STORAGE_KEY_BOOKINGS_DB, JSON.stringify(SEED_BOOKINGS));
          setBookings(SEED_BOOKINGS);
        } else {
          setBookings(JSON.parse(storedBookings));
        }
      }
    } catch (e) {
      console.warn('Error reading mock bookings store:', e);
    }

    // 1. Validar sesión real contra el servidor (getUser hace round-trip, evita cache stale)
    supabase.auth.getUser().then(({ data: { user: sbUser }, error }) => {
      if (!isMounted) return;
      if (error || !sbUser) {
        setUser(null);
      } else {
        setUser(mapSupabaseUserToProfile(sbUser));
      }
      setIsLoading(false);
    });

    // 2. Sincronizar cambios de autenticación en tiempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      // SIGNED_OUT siempre limpia, incluso si hay cache local
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
      } else {
        setUser(mapSupabaseUserToProfile(session.user));
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Supabase login handler
  const login = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const raw = identifier.trim();
    const cleanPass = password.trim();

    if (!raw) {
      return { success: false, error: 'Por favor ingresa tu correo electrónico o usuario.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Por favor ingresa tu contraseña.' };
    }

    // Resolve target email for Supabase Auth
    let emailToUse = raw;
    if (!raw.includes('@')) {
      if (raw.toLowerCase() === 'sebastian_v') {
        emailToUse = 'cliente@espaciointimo.pe';
      } else if (raw.toLowerCase() === 'admin_ei') {
        emailToUse = 'admin@espaciointimo.pe';
      } else {
        emailToUse = `${raw.toLowerCase().replace(/^@/, '')}@espaciointimo.pe`;
      }
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: cleanPass
      });

      if (error) {
        let friendlyError = error.message;
        if (error.message.includes('Invalid login credentials')) {
          friendlyError = 'Credenciales no válidas. Verifica tu correo y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          friendlyError = 'Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.';
        }
        return { success: false, error: friendlyError };
      }

      if (!data.user) {
        return { success: false, error: 'No se pudo obtener la sesión de usuario.' };
      }

      const profile = mapSupabaseUserToProfile(data.user);
      setUser(profile);
      return { success: true, user: profile };
    } catch (err) {
      console.error('Error during Supabase login:', err);
      return { success: false, error: 'Error de conexión con el servicio de autenticación.' };
    }
  };

  // Supabase register handler
  const register = async (
    name: string,
    lastName: string,
    username: string,
    phone: string,
    password: string,
    email?: string
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const cleanName = name.trim();
    const cleanLastName = lastName.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanPass = password.trim();
    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : `${cleanUsername}@espaciointimo.pe`;

    if (!cleanName || !cleanLastName || !cleanUsername || !cleanPhone || !cleanPass) {
      return { success: false, error: 'Por favor completa todos los campos requeridos.' };
    }

    if (cleanUsername.length < 3) {
      return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres.' };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newMemberCode = `EI-VIP-${randomNum}`;

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: {
            name: cleanName,
            lastName: cleanLastName,
            username: cleanUsername,
            phone: `+${cleanPhone}`,
            // SECURITY: Never grant admin privileges automatically on registration
            role: 'client',
            membershipTier: 'vip',
            memberCode: newMemberCode
          }
        }
      });

      if (error) {
        let friendlyError = error.message;
        if (error.message.includes('User already registered')) {
          friendlyError = 'Ya existe una cuenta con este correo electrónico.';
        } else if (error.message.includes('Password should be')) {
          friendlyError = 'La contraseña debe tener al menos 6 caracteres.';
        }
        return { success: false, error: friendlyError };
      }

      if (data.user) {
        const profile = mapSupabaseUserToProfile(data.user);
        if (data.session) {
          setUser(profile);
        }
        return { success: true, user: profile };
      }

      return { success: true };
    } catch (err) {
      console.error('Error during Supabase registration:', err);
      return { success: false, error: 'Error de conexión con el servicio de autenticación.' };
    }
  };

  // Supabase logout handler — invalida sesión en servidor y limpia todo cliente
  const logout = async () => {
    try {
      const supabase = createClient();
      // scope:'global' invalida el refresh token en el servidor — previene re-auth por cookie
      await supabase.auth.signOut({ scope: 'global' }).catch(() => {});
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      // Limpiar estado local inmediatamente
      setUser(null);
      if (typeof window !== 'undefined') {
        try {
          // Eliminar todos los tokens Supabase del almacenamiento local
          [...Object.keys(localStorage)].forEach((key) => {
            if (key.startsWith('sb-') || key.includes('supabase')) {
              localStorage.removeItem(key);
            }
          });
          [...Object.keys(sessionStorage)].forEach((key) => {
            if (key.startsWith('sb-') || key.includes('supabase')) {
              sessionStorage.removeItem(key);
            }
          });
        } catch (e) {
          console.warn('Error clearing storage on logout', e);
        }
        // Limpiar cookies del servidor vía API route y redirigir
        fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
          window.location.href = '/';
        });
      }
    }
  };

  // Update profile in Supabase user_metadata
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);

    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          name: updated.name,
          lastName: updated.lastName,
          phone: updated.phone
        }
      });
    } catch (err) {
      console.error('Error updating profile in Supabase:', err);
    }
  };

  // Update preferences in Supabase user_metadata
  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) return;
    const updated = { ...user, preferences: { ...user.preferences, ...preferences } };
    setUser(updated);

    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          preferences: updated.preferences
        }
      });
    } catch (err) {
      console.error('Error updating preferences in Supabase:', err);
    }
  };

  // Create booking (persisted in mock business store)
  const createBooking = (bookingData: Omit<UserBooking, 'id' | 'createdAt' | 'status'>) => {
    const bookingId = `EI-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: UserBooking = {
      ...bookingData,
      id: bookingId,
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_BOOKINGS_DB, JSON.stringify(updated));
    }
    return newBooking;
  };

  // Update booking status
  const updateBookingStatus = (id: string, status: BookingStatus, therapist?: string) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status,
          ...(therapist ? { therapist } : {})
        };
      }
      return b;
    });

    setBookings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_BOOKINGS_DB, JSON.stringify(updated));
    }
  };

  // Cancel booking
  const cancelBooking = (id: string) => {
    updateBookingStatus(id, 'cancelada');
  };

  // Filter bookings for current user
  const getUserBookings = () => {
    if (!user) return [];
    if (user.role === 'admin') return bookings;
    return bookings.filter(b => 
      b.userId === user.id || 
      (b.userEmail && user.email && b.userEmail.toLowerCase() === user.email.toLowerCase()) ||
      (b.userPhone && user.phone && b.userPhone.includes(user.phone.replace(/\D/g, '').slice(-7)))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        bookings,
        login,
        register,
        logout,
        updateProfile,
        updatePreferences,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        getUserBookings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
