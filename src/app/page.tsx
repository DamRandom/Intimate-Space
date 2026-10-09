'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { TeamSection } from '@/components/home/TeamSection';
import { BookingSection } from '@/components/booking/BookingSection';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { Service } from '@/types';

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleSelectServiceForBooking = (service: Service) => {
    setSelectedService(service);
    const bookingSection = document.getElementById('reservas');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="site-wrapper">
      <Navbar />

      <main>
        <HeroSection />
        <BrandStorySection />
        <TeamSection />
        <BookingSection selectedServicePreload={selectedService} />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
