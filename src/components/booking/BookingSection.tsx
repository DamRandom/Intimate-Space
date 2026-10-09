import React from 'react';
import { BookingForm } from './BookingForm';
import { Service } from '@/types';

interface BookingSectionProps {
  selectedServicePreload?: Service | null;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ selectedServicePreload }) => {
  return (
    <section id="reservas" className="section-zen">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Reserva Privada</span>
          <h2 className="section-heading">Coordina tu Sesión</h2>
          <p className="section-subtext">
            Para garantizar la calma y discreción de cada huésped, atendemos únicamente con cita programada.
          </p>
        </div>

        <BookingForm selectedServicePreload={selectedServicePreload} />
      </div>
    </section>
  );
};
