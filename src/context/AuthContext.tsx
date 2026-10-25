'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserBooking, 
  UserPreferences, 
  BookingStatus 
} from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  bookings: UserBooking[];
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  register: (name: string, lastName: string, username: string, phone: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updatePreferences: (preferences: UserPreferences) => void;
  createBooking: (booking: Omit<UserBooking, 'id' | 'createdAt' | 'status'>) => UserBooking;
  updateBookingStatus: (id: string, status: BookingStatus, therapist?: string) => void;
  cancelBooking: (id: string) => void;
  getUserBookings: () => UserBooking[];
}

const STORAGE_KEY_USER = 'espacio_intimo_current_user';
const STORAGE_KEY_USERS_DB = 'espacio_intimo_registered_users';
const STORAGE_KEY_BOOKINGS_DB = 'espacio_intimo_all_bookings';

// Seed demo users
const SEED_USERS: (UserProfile & { password: string })[] = [
  {
    id: 'user-admin-1',
    name: 'Concierge',
    lastName: 'Espacio Íntimo',
    username: 'admin_ei',
    email: 'admin@espaciointimo.pe',
    phone: '+51 984 416 350',
    role: 'admin',
    membershipTier: 'black_label',
    memberCode: 'EI-ADM-001',
    createdAt: '2025-01-01',
    password: 'admin123',
    preferences: {
      aroma: 'Sándalo Oriental & Ámbar',
      pressure: 'firme',
      beverage: 'Espresso Ristretto',
      notes: 'Administrador central de conserjería'
    }
  },
  {
    id: 'user-client-1',
    name: 'Sebastián',
    lastName: 'Valdivia',
    username: 'sebastian_v',
    email: 'cliente@espaciointimo.pe',
    phone: '+51987654321',
    role: 'client',
    membershipTier: 'vip',
    memberCode: 'EI-VIP-842',
    createdAt: '2025-02-14',
    password: 'cliente123',
    preferences: {
      aroma: 'Eucalipto & Cedro Silvestre',
      pressure: 'profunda',
      beverage: 'Infusión de Menta Andina',
      notes: 'Foco de tensión en trapecios y lumbares. Prefiere música ambiental con frecuencias 432Hz.'
    }
  }
];

// Seed demo bookings
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from storage or seed
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Users DB
        const storedUsers = localStorage.getItem(STORAGE_KEY_USERS_DB);
        if (!storedUsers) {
          localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(SEED_USERS));
        }

        // Bookings DB
        const storedBookings = localStorage.getItem(STORAGE_KEY_BOOKINGS_DB);
        if (!storedBookings) {
          localStorage.setItem(STORAGE_KEY_BOOKINGS_DB, JSON.stringify(SEED_BOOKINGS));
          setBookings(SEED_BOOKINGS);
        } else {
          setBookings(JSON.parse(storedBookings));
        }

        // Current session
        const activeUser = localStorage.getItem(STORAGE_KEY_USER);
        if (activeUser) {
          setUser(JSON.parse(activeUser));
        }
      }
    } catch (error) {
      console.error('Error loading auth from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save current user to storage helper
  const persistSession = (profile: UserProfile | null) => {
    setUser(profile);
    if (typeof window !== 'undefined') {
      if (profile) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
  };

  // Helper to fetch registered users
  const getRegisteredUsers = (): (UserProfile & { password: string })[] => {
    if (typeof window === 'undefined') return SEED_USERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS_DB);
      return stored ? JSON.parse(stored) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  };

  // Login handler — accepts username + password only
  const login = (identifier: string, password: string) => {
    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    const users = getRegisteredUsers();
    const found = users.find(u => u.username?.toLowerCase() === cleanIdentifier);

    if (!found) {
      return {
        success: false,
        error: 'No encontramos una cuenta con este usuario.'
      };
    }

    if (found.password !== cleanPass) {
      return {
        success: false,
        error: 'La contraseña ingresada no es correcta.'
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userProfile } = found;
    persistSession(userProfile);
    return { success: true };
  };

  // Register handler — creates client account
  const register = (name: string, lastName: string, username: string, phone: string, password: string) => {
    const cleanName = name.trim();
    const cleanLastName = lastName.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanPass = password.trim();

    if (!cleanName || !cleanLastName || !cleanUsername || !cleanPhone || !cleanPass) {
      return { success: false, error: 'Por favor completa todos los campos requeridos.' };
    }

    if (cleanUsername.length < 3) {
      return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres.' };
    }

    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      return { success: false, error: 'El usuario solo puede contener letras, números y guión bajo.' };
    }

    if (cleanPhone.length < 7) {
      return { success: false, error: 'Ingresa un número de teléfono válido.' };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const users = getRegisteredUsers();

    if (users.some(u => u.username?.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Este nombre de usuario ya está en uso. Elige otro.' };
    }

    if (users.some(u => u.phone.replace(/\D/g, '').endsWith(cleanPhone) && cleanPhone.length >= 7)) {
      return { success: false, error: 'Ya existe una cuenta con este número de teléfono.' };
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newMemberCode = `EI-VIP-${randomNum}`;

    const newUser: UserProfile & { password: string } = {
      id: `user-client-${Date.now()}`,
      name: cleanName,
      lastName: cleanLastName,
      username: cleanUsername,
      phone: `+${cleanPhone}`,
      role: 'client',
      membershipTier: 'vip',
      memberCode: newMemberCode,
      createdAt: new Date().toISOString().split('T')[0],
      password: cleanPass,
      preferences: {
        aroma: 'Eucalipto & Cedro Silvestre',
        pressure: 'media',
        beverage: 'Agua alcalina aromatizada',
        notes: ''
      }
    };

    const updatedUsers = [...users, newUser];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(updatedUsers));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userProfile } = newUser;
    persistSession(userProfile);
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    persistSession(null);
  };

  // Update profile
  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    persistSession(updated);

    // Also update in registered users DB
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...data } : u);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(updatedUsers));
    }
  };

  // Update preferences
  const updatePreferences = (preferences: UserPreferences) => {
    if (!user) return;
    updateProfile({ preferences: { ...user.preferences, ...preferences } });
  };

  // Create booking
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
