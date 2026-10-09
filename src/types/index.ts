export type ServiceCategory = 'all' | 'terapeutico' | 'relajacion' | 'energetico' | 'deportivo' | 'sensorial';

export interface PriceOption {
  duration: string;
  regular: number;
  discount: number;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  tag: string;
  description: string;
  image: string;
  prices: PriceOption[];
}

export interface BrandPillar {
  id: string;
  title: string;
  description: string;
  iconName: 'ShieldCheck' | 'Sparkles' | 'Users' | 'MapPin' | 'Flame' | 'HeartPulse';
}

export interface InstagramPostQuote {
  id: string;
  title: string;
  quote: string;
  tag: string;
  hashtags: string[];
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  serviceId: string;
  duration: string;
  date: string;
  timeSlot: string;
  notes: string;
}
