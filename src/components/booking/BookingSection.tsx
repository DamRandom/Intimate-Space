import React from 'react';
import { BookingForm } from './BookingForm';
import { Service } from '@/types';

interface BookingSectionProps {
  selectedServicePreload?: Service | null;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ selectedServicePreload }) => {
  return (
    <section id="reservas" className="section-zen zen-booking-section">
      <div className="container relative z-10">
        <div className="text-center zen-booking-header">
          <span className="section-label">Reserva Privada</span>
          <h2 className="section-heading">Coordina tu Sesión</h2>
          <p className="section-subtext">
            Para garantizar la calma y discreción de cada huésped, atendemos exclusivamente con cita programada en Miraflores.
          </p>
        </div>

        <BookingForm selectedServicePreload={selectedServicePreload} />
      </div>
    </section>
  );
};

