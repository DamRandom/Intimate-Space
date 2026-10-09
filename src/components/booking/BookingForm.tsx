'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SERVICES_DATA } from '@/data/services';
import { BRAND_CONFIG } from '@/data/brand';
import { BookingFormData, Service } from '@/types';
import { 
  ChevronDown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  Send,
  User,
  Phone,
  LucideIcon
} from 'lucide-react';

interface BookingFormProps {
  selectedServicePreload?: Service | null;
}

interface TimeSlotOption {
  value: string;
  label: string;
  sub: string;
  icon: LucideIcon;
}

const TIME_SLOT_OPTIONS: TimeSlotOption[] = [
  {
    value: 'Mañana (10:00 a 14:00)',
    label: 'Mañana',
    sub: '10:00 a 14:00',
    icon: Sun
  },
  {
    value: 'Tarde (15:00 a 19:00)',
    label: 'Tarde',
    sub: '15:00 a 19:00',
    icon: Sunset
  },
  {
    value: 'Noche (19:00 a 22:00)',
    label: 'Noche',
    sub: '19:00 a 22:00',
    icon: Moon
  }
];

export const BookingForm: React.FC<BookingFormProps> = ({ selectedServicePreload }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    serviceId: SERVICES_DATA[0].id,
    duration: SERVICES_DATA[0].prices[0].duration,
    date: '',
    timeSlot: 'Tarde (15:00 a 19:00)',
    notes: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);

  const serviceSelectRef = useRef<HTMLDivElement>(null);
  const timeSelectRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceSelectRef.current && !serviceSelectRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
      if (timeSelectRef.current && !timeSelectRef.current.contains(event.target as Node)) {
        setIsTimeSlotOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsServiceOpen(false);
        setIsTimeSlotOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update on preload prop change
  useEffect(() => {
    if (selectedServicePreload) {
      setFormData((prev) => ({
        ...prev,
        serviceId: selectedServicePreload.id,
        duration: selectedServicePreload.prices[0].duration
      }));
    }
  }, [selectedServicePreload]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectService = (service: Service) => {
    setFormData((prev) => {
      // Check if current duration exists in new service; if not, pick the first
      const hasDuration = service.prices.some((p) => p.duration === prev.duration);
      return {
        ...prev,
        serviceId: service.id,
        duration: hasDuration ? prev.duration : service.prices[0].duration
      };
    });
    setIsServiceOpen(false);
  };

  const handleSelectTimeSlot = (slotValue: string) => {
    setFormData((prev) => ({ ...prev, timeSlot: slotValue }));
    setIsTimeSlotOpen(false);
  };

  const handleDurationSelect = (duration: string) => {
    setFormData((prev) => ({ ...prev, duration }));
  };

  const activeService = SERVICES_DATA.find((s) => s.id === formData.serviceId) || SERVICES_DATA[0];
  const activePriceObj = activeService.prices.find((p) => p.duration === formData.duration) || activeService.prices[0];
  const activeTimeSlotObj = TIME_SLOT_OPTIONS.find((t) => t.value === formData.timeSlot) || TIME_SLOT_OPTIONS[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceText = activePriceObj ? `S/ ${activePriceObj.discount}` : 'A coordinar';

    const message = 
`🍃 *RESERVA PRIVADA - ESPACIO ÍNTIMO* 🍃

• *Nombre / Alias:* ${formData.fullName.trim()}
• *WhatsApp:* ${formData.phone.trim()}
• *Experiencia:* ${activeService.name} (${activeService.tag})
• *Duración:* ${formData.duration} (Tarifa: ${priceText})
• *Fecha tentativa:* ${formData.date || 'Por coordinar'}
• *Horario:* ${formData.timeSlot}
${formData.notes ? `• *Notas:* ${formData.notes.trim()}\n` : ''}
_Miraflores, Lima • Atención 100% privada con previa coordinación._`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}?text=${encodedMessage}`;

    setIsSuccess(true);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="zen-booking-box">
      {isSuccess ? (
        <div className="zen-success-box">
          <h3 className="zen-success-title">Mensaje Preparado</h3>
          <p className="zen-success-desc">
            Te hemos conectado con nuestro canal privado de WhatsApp para confirmar fecha y detalles de acceso en Miraflores.
          </p>
          <a
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-zen-filled"
          >
            Abrir WhatsApp Directo
          </a>
          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-zen-subtle"
              onClick={() => setIsSuccess(false)}
            >
              Modificar solicitud
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="zen-form-grid">
            {/* Nombre o Alias */}
            <div className="zen-form-group">
              <label htmlFor="fullName" className="zen-label">
                <User size={13} className="zen-label-icon" />
                Nombre o Alias
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                placeholder="Tu nombre o alias preferido"
                value={formData.fullName}
                onChange={handleChange}
                className="zen-input"
              />
            </div>

            {/* WhatsApp */}
            <div className="zen-form-group">
              <label htmlFor="phone" className="zen-label">
                <Phone size={13} className="zen-label-icon" />
                WhatsApp de Contacto
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="+51 900 000 000"
                value={formData.phone}
                onChange={handleChange}
                className="zen-input"
              />
            </div>

            {/* Selector de Experiencia / Masaje - Custom Dropdown */}
            <div className="zen-form-group full-width" ref={serviceSelectRef}>
              <label className="zen-label">
                <Sparkles size={13} className="zen-label-icon" />
                Experiencia Deseada
              </label>

              <div className="zen-custom-select-wrapper">
                <button
                  type="button"
                  className={`zen-custom-select-trigger ${isServiceOpen ? 'is-open' : ''}`}
                  onClick={() => {
                    setIsServiceOpen(!isServiceOpen);
                    setIsTimeSlotOpen(false);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isServiceOpen}
                >
                  <div className="zen-select-trigger-content">
                    <span className="zen-select-trigger-title">{activeService.name}</span>
                    <span className="zen-select-trigger-badge">{activeService.tag}</span>
                  </div>
                  <ChevronDown size={18} className="zen-select-chevron" />
                </button>

                {isServiceOpen && (
                  <div className="zen-custom-select-menu" role="listbox">
                    {SERVICES_DATA.map((service) => {
                      const isSelected = service.id === activeService.id;
                      const minPrice = service.prices[0]?.discount || service.prices[0]?.regular;

                      return (
                        <div
                          key={service.id}
                          role="option"
                          aria-selected={isSelected}
                          className={`zen-select-option ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleSelectService(service)}
                        >
                          <div className="zen-option-main">
                            <div className="zen-option-header">
                              <span className="zen-option-title">{service.name}</span>
                              <span className="zen-option-tag">{service.tag}</span>
                            </div>
                            <div className="zen-option-meta">
                              <span>{service.prices.map((p) => p.duration).join(' · ')}</span>
                              <span className="zen-option-price">Desde S/ {minPrice}</span>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="zen-option-check">
                              <Check size={16} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Selector de Duración con Tarjetas de Precios */}
            <div className="zen-form-group full-width">
              <label className="zen-label">
                <Clock size={13} className="zen-label-icon" />
                Duración & Inversión
              </label>
              <div className="zen-durations-grid">
                {activeService.prices.map((p) => {
                  const isActive = formData.duration === p.duration;
                  return (
                    <button
                      key={p.duration}
                      type="button"
                      className={`zen-duration-card ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleDurationSelect(p.duration)}
                    >
                      <span className="zen-duration-time">{p.duration}</span>
                      <div className="zen-duration-pricing">
                        <span className="zen-duration-discount">S/ {p.discount}</span>
                        {p.regular > p.discount && (
                          <span className="zen-duration-regular">S/ {p.regular}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fecha Preferida */}
            <div className="zen-form-group">
              <label htmlFor="date" className="zen-label">
                <Calendar size={13} className="zen-label-icon" />
                Fecha Tentativa
              </label>
              <input
                type="date"
                id="date"
                name="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={handleChange}
                className="zen-input"
              />
            </div>

            {/* Selector de Horario - Custom Dropdown */}
            <div className="zen-form-group" ref={timeSelectRef}>
              <label className="zen-label">
                <Clock size={13} className="zen-label-icon" />
                Horario Preferido
              </label>

              <div className="zen-custom-select-wrapper">
                <button
                  type="button"
                  className={`zen-custom-select-trigger ${isTimeSlotOpen ? 'is-open' : ''}`}
                  onClick={() => {
                    setIsTimeSlotOpen(!isTimeSlotOpen);
                    setIsServiceOpen(false);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isTimeSlotOpen}
                >
                  <div className="zen-select-trigger-content">
                    {React.createElement(activeTimeSlotObj.icon, { size: 16, className: 'zen-label-icon' })}
                    <span className="zen-select-trigger-title">{activeTimeSlotObj.value}</span>
                  </div>
                  <ChevronDown size={18} className="zen-select-chevron" />
                </button>

                {isTimeSlotOpen && (
                  <div className="zen-custom-select-menu" role="listbox">
                    {TIME_SLOT_OPTIONS.map((slot) => {
                      const isSelected = slot.value === formData.timeSlot;
                      const IconComponent = slot.icon;

                      return (
                        <div
                          key={slot.value}
                          role="option"
                          aria-selected={isSelected}
                          className={`zen-select-option ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleSelectTimeSlot(slot.value)}
                        >
                          <div className="zen-option-main">
                            <div className="zen-option-header">
                              <IconComponent size={15} style={{ color: 'var(--champagne)' }} />
                              <span className="zen-option-title">{slot.label}</span>
                              <span className="zen-option-tag">{slot.sub}</span>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="zen-option-check">
                              <Check size={16} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Preferencias / Notas */}
            <div className="zen-form-group full-width">
              <label htmlFor="notes" className="zen-label">
                Preferencia o Zona de Enfoque (Opcional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Contracturas en cuello/espalda baja, nivel de presión preferido..."
                value={formData.notes}
                onChange={handleChange}
                className="zen-textarea"
              />
            </div>
          </div>

          {/* Tarjeta de Resumen Concierge en Vivo */}
          <div className="zen-booking-summary">
            <div className="zen-summary-top">
              <span className="zen-summary-badge">
                <Sparkles size={13} />
                Resumen de Sesión
              </span>
              <span className="zen-summary-price">
                S/ {activePriceObj.discount}
              </span>
            </div>
            <div className="zen-summary-details">
              <div className="zen-summary-detail-item">
                <span>Experiencia:</span>
                <strong>{activeService.name}</strong>
              </div>
              <div className="zen-summary-detail-item">
                <span>Duración:</span>
                <strong>{formData.duration}</strong>
              </div>
              <div className="zen-summary-detail-item">
                <span>Horario:</span>
                <strong>{formData.timeSlot.split(' ')[0]}</strong>
              </div>
              {formData.date && (
                <div className="zen-summary-detail-item">
                  <span>Fecha:</span>
                  <strong>{formData.date}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Botón de Enviar a WhatsApp */}
          <div style={{ textAlign: 'center', marginTop: '1.8rem' }}>
            <button 
              type="submit" 
              className="btn-zen-filled" 
              style={{ 
                width: '100%', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.65rem',
                fontSize: '0.92rem',
                letterSpacing: '0.08em'
              }}
            >
              <Send size={16} />
              Solicitar Reserva en WhatsApp
            </button>
            <p className="zen-booking-discretion">
              <ShieldCheck size={14} style={{ color: 'var(--champagne)' }} />
              Atención 100% privada bajo reserva previa en Miraflores. Discreción absoluta.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
