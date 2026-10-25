'use client';

import React, { useState, useEffect } from 'react';
import { SERVICES_DATA } from '@/data/services';
import { BRAND_CONFIG } from '@/data/brand';
import { BookingFormData, Service } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface BookingFormProps {
  selectedServicePreload?: Service | null;
}

const TIME_SLOTS = [
  { value: 'Mañana (10:00 - 14:00)', label: 'Mañana', hours: '10:00 - 14:00' },
  { value: 'Tarde (15:00 - 19:00)', label: 'Tarde', hours: '15:00 - 19:00' },
  { value: 'Noche (19:00 - 22:00)', label: 'Noche', hours: '19:00 - 22:00' },
];

export const BookingForm: React.FC<BookingFormProps> = ({ selectedServicePreload }) => {
  const { user, createBooking } = useAuth();

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    serviceId: SERVICES_DATA[0].id,
    duration: SERVICES_DATA[0].prices[0].duration,
    date: '',
    timeSlot: 'Tarde (15:00 - 19:00)',
    notes: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        phone: prev.phone || user.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (selectedServicePreload) {
      setFormData((prev) => ({
        ...prev,
        serviceId: selectedServicePreload.id,
        duration: selectedServicePreload.prices[0].duration,
      }));
    }
  }, [selectedServicePreload]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'serviceId') {
      const selected = SERVICES_DATA.find((s) => s.id === value);
      setFormData((prev) => ({
        ...prev,
        serviceId: value,
        duration: selected ? selected.prices[0].duration : prev.duration,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const activeService = SERVICES_DATA.find((s) => s.id === formData.serviceId) || SERVICES_DATA[0];
  const activePriceObj = activeService.prices[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceText = activePriceObj ? `S/ ${activePriceObj.discount}` : 'A coordinar';

    try {
      createBooking({
        userId: user?.id,
        userName: formData.fullName.trim(),
        userPhone: formData.phone.trim(),
        userEmail: user?.email,
        serviceId: activeService.id,
        serviceName: activeService.name,
        serviceTag: activeService.tag,
        duration: activePriceObj.duration,
        price: priceText,
        date: formData.date || 'Por coordinar',
        timeSlot: formData.timeSlot,
        notes: formData.notes.trim(),
      });
    } catch (err) {
      console.error('Error al guardar reserva:', err);
    }

    const message = 
`*SOLICITUD DE RESERVA - ESPACIO ÍNTIMO*

• Nombre: ${formData.fullName.trim()}
• WhatsApp: ${formData.phone.trim()}
• Masaje: ${activeService.name} (${activeService.tag})
• Duración: ${activePriceObj.duration} — S/ ${activePriceObj.discount}
• Fecha tentativa: ${formData.date || 'Por coordinar'}
• Turno preferido: ${formData.timeSlot}
${formData.notes ? `• Comentarios: ${formData.notes.trim()}\n` : ''}
Miraflores, Lima • Atención privada con cita confirmada.`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}?text=${encodedMessage}`;

    setIsSuccess(true);
    window.open(waUrl, '_blank');
  };

  if (isSuccess) {
    return (
      <div className="zen-booking-box text-center">
        <h3 className="zen-success-title">Solicitud Enviada</h3>
        <p className="zen-success-desc">
          Te hemos conectado con nuestro concierge en WhatsApp para confirmar la disponibilidad y darte los detalles de acceso en Miraflores.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '300px', margin: '2rem auto 0' }}>
          <a
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-zen-filled"
            style={{ width: '100%', textAlign: 'center' }}
          >
            Abrir WhatsApp
          </a>
          <button
            type="button"
            className="btn-zen-subtle"
            onClick={() => setIsSuccess(false)}
          >
            Nueva Reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="zen-booking-box">
      <form onSubmit={handleSubmit} className="zen-fluid-form">
        {/* Campo 1: Selección de Masaje */}
        <div className="zen-form-group">
          <label htmlFor="serviceId" className="zen-label-fluid">
            Experiencia de Masaje
          </label>
          <select
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            className="zen-select-fluid"
          >
            {SERVICES_DATA.map((service) => {
              const price = service.prices[0]?.discount || service.prices[0]?.regular;
              const duration = service.prices[0]?.duration;
              return (
                <option key={service.id} value={service.id}>
                  {service.name} — {duration} (S/ {price})
                </option>
              );
            })}
          </select>
        </div>

        {/* Campo 2: Fecha & Turno */}
        <div className="zen-fluid-grid-2">
          <div className="zen-form-group">
            <label htmlFor="date" className="zen-label-fluid">
              Fecha Tentativa
            </label>
            <input
              type="date"
              id="date"
              name="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={handleChange}
              className="zen-input-fluid"
            />
          </div>

          <div className="zen-form-group">
            <label className="zen-label-fluid">
              Turno de Preferencia
            </label>
            <div className="zen-turn-chips">
              {TIME_SLOTS.map((slot) => {
                const isSelected = formData.timeSlot === slot.value;
                return (
                  <button
                    key={slot.value}
                    type="button"
                    className={`zen-turn-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot.value }))}
                  >
                    <span>{slot.label}</span>
                    <small>{slot.hours}</small>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Campo 3: Nombre & Teléfono */}
        <div className="zen-fluid-grid-2">
          <div className="zen-form-group">
            <label htmlFor="fullName" className="zen-label-fluid">
              Nombre o Alias
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              placeholder="¿Cómo prefieres que te llamemos?"
              value={formData.fullName}
              onChange={handleChange}
              className="zen-input-fluid"
            />
          </div>

          <div className="zen-form-group">
            <label htmlFor="phone" className="zen-label-fluid">
              Teléfono WhatsApp
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="+51 900 000 000"
              value={formData.phone}
              onChange={handleChange}
              className="zen-input-fluid"
            />
          </div>
        </div>

        {/* Campo 4: Notas / Preferencias opcionales */}
        <div className="zen-form-group">
          <label htmlFor="notes" className="zen-label-fluid">
            Preferencias o Zonas de Tensión <span style={{ opacity: 0.6, fontWeight: 300 }}>(opcional)</span>
          </label>
          <input
            type="text"
            id="notes"
            name="notes"
            placeholder="Ej. tensión en espalda baja, nivel de presión deseado..."
            value={formData.notes}
            onChange={handleChange}
            className="zen-input-fluid"
          />
        </div>

        {/* Resumen sutil y Botón de Enviar */}
        <div className="zen-fluid-submit-wrap">
          <button type="submit" className="btn-zen-filled zen-fluid-submit-btn">
            Solicitar Cita por WhatsApp
          </button>
          <p className="zen-fluid-discretion-note">
            Atención privada exclusivamente previa cita coordinada en Miraflores. Discreción absoluta.
          </p>
        </div>
      </form>
    </div>
  );
};

