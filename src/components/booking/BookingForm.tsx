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
  hours: string;
  icon: LucideIcon;
}

const TIME_SLOT_OPTIONS: TimeSlotOption[] = [
  {
    value: 'Mañana (10:00 a 14:00)',
    label: 'Mañana',
    hours: '10:00 - 14:00',
    icon: Sun
  },
  {
    value: 'Tarde (15:00 a 19:00)',
    label: 'Tarde',
    hours: '15:00 - 19:00',
    icon: Sunset
  },
  {
    value: 'Noche (19:00 a 22:00)',
    label: 'Noche',
    hours: '19:00 - 22:00',
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
  const [showNotes, setShowNotes] = useState(false);

  const serviceSelectRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceSelectRef.current && !serviceSelectRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsServiceOpen(false);
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
    setFormData((prev) => ({
      ...prev,
      serviceId: service.id,
      // Fixed duration based on the service
      duration: service.prices[0].duration
    }));
    setIsServiceOpen(false);
  };

  const handleSelectTimeSlot = (slotValue: string) => {
    setFormData((prev) => ({ ...prev, timeSlot: slotValue }));
  };

  const activeService = SERVICES_DATA.find((s) => s.id === formData.serviceId) || SERVICES_DATA[0];
  const activePriceObj = activeService.prices[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceText = activePriceObj ? `S/ ${activePriceObj.discount}` : 'A coordinar';

    const message = 
`🍃 *SOLICITUD DE RESERVA - ESPACIO ÍNTIMO* 🍃

• *Nombre / Alias:* ${formData.fullName.trim()}
• *WhatsApp:* ${formData.phone.trim()}
• *Experiencia:* ${activeService.name} (${activeService.tag})
• *Duración fija:* ${activePriceObj.duration} (Tarifa: ${priceText})
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
          <div className="zen-success-icon-badge">
            <Check size={28} />
          </div>
          <h3 className="zen-success-title">Sesión Preparada</h3>
          <p className="zen-success-desc">
            Te hemos conectado con nuestro canal privado de WhatsApp para confirmar fecha y detalles de acceso en Miraflores.
          </p>
          <a
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-zen-filled"
            style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}
          >
            Abrir WhatsApp Directo
          </a>
          <div style={{ marginTop: '1.25rem' }}>
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
        <form onSubmit={handleSubmit} className="zen-booking-form">
          {/* BLOQUE 1: Experiencia (con duración fija informada) */}
          <div className="zen-form-step">
            <div className="zen-step-header">
              <span className="zen-step-num">1</span>
              <div>
                <h4 className="zen-step-title">Experiencia de Masaje</h4>
                <p className="zen-step-subtitle">Selecciona el tratamiento deseado</p>
              </div>
            </div>

            {/* Custom Dropdown */}
            <div className="zen-form-field" ref={serviceSelectRef}>
              <div className="zen-custom-select-wrapper">
                <button
                  type="button"
                  className={`zen-custom-select-trigger ${isServiceOpen ? 'is-open' : ''}`}
                  onClick={() => setIsServiceOpen(!isServiceOpen)}
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
                      const price = service.prices[0]?.discount || service.prices[0]?.regular;
                      const duration = service.prices[0]?.duration;

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
                              <span>Duración: {duration}</span>
                              <span className="zen-option-price">S/ {price}</span>
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

            {/* Duración y Precio Informados (Tiempo Fijo por Masaje) */}
            <div className="zen-fixed-duration-info">
              <div className="zen-fixed-duration-item">
                <Clock size={14} className="zen-fixed-icon" />
                <span className="zen-fixed-label">Tiempo de sesión:</span>
                <strong className="zen-fixed-value">{activePriceObj.duration}</strong>
              </div>

              <div className="zen-fixed-price-item">
                <span className="zen-fixed-label">Inversión:</span>
                <strong className="zen-fixed-price">S/ {activePriceObj.discount}</strong>
                {activePriceObj.regular > activePriceObj.discount && (
                  <span className="zen-fixed-regular">Regular S/ {activePriceObj.regular}</span>
                )}
              </div>
            </div>
          </div>

          {/* BLOQUE 2: Fecha y Turno (Segmented Control táctil) */}
          <div className="zen-form-step">
            <div className="zen-step-header">
              <span className="zen-step-num">2</span>
              <div>
                <h4 className="zen-step-title">Fecha & Horario</h4>
                <p className="zen-step-subtitle">Tu disponibilidad tentativa en Miraflores</p>
              </div>
            </div>

            <div className="zen-step-row-2">
              {/* Fecha */}
              <div className="zen-form-field">
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

              {/* Turnos Táctiles */}
              <div className="zen-form-field">
                <label className="zen-label">
                  <Clock size={13} className="zen-label-icon" />
                  Turno Preferido
                </label>
                <div className="zen-timeslot-pills">
                  {TIME_SLOT_OPTIONS.map((slot) => {
                    const isSelected = formData.timeSlot === slot.value;
                    const IconComp = slot.icon;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        className={`zen-slot-pill ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => handleSelectTimeSlot(slot.value)}
                      >
                        <IconComp size={14} className="zen-slot-icon" />
                        <span className="zen-slot-name">{slot.label}</span>
                        <span className="zen-slot-hours">{slot.hours}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* BLOQUE 3: Datos de Contacto */}
          <div className="zen-form-step">
            <div className="zen-step-header">
              <span className="zen-step-num">3</span>
              <div>
                <h4 className="zen-step-title">Datos de Contacto</h4>
                <p className="zen-step-subtitle">Atención 100% privada y confidencial</p>
              </div>
            </div>

            <div className="zen-step-row-2">
              <div className="zen-form-field">
                <label htmlFor="fullName" className="zen-label">
                  <User size={13} className="zen-label-icon" />
                  Nombre o Alias
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Tu nombre o alias"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="zen-input"
                />
              </div>

              <div className="zen-form-field">
                <label htmlFor="phone" className="zen-label">
                  <Phone size={13} className="zen-label-icon" />
                  WhatsApp
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
            </div>

            {/* Notas opcionales colapsables */}
            <div className="zen-notes-toggle-box">
              <button
                type="button"
                className="zen-notes-toggle-btn"
                onClick={() => setShowNotes(!showNotes)}
              >
                <span>{showNotes ? '— Ocultar notas' : '+ Agregar preferencias o zonas de tensión (opcional)'}</span>
              </button>

              {showNotes && (
                <div className="zen-notes-wrapper">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    placeholder="Contracturas en cuello/espalda, nivel de presión preferido..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="zen-textarea"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Resumen Concierge & Botón de Enviar */}
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
                <span>Servicio:</span>
                <strong>{activeService.name}</strong>
              </div>
              <div className="zen-summary-detail-item">
                <span>Duración fija:</span>
                <strong>{activePriceObj.duration}</strong>
              </div>
              <div className="zen-summary-detail-item">
                <span>Turno:</span>
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

          <div className="zen-booking-actions">
            <button 
              type="submit" 
              className="btn-zen-filled zen-booking-submit-btn"
            >
              <Send size={16} />
              Confirmar Reserva en WhatsApp
            </button>
            <p className="zen-booking-discretion">
              <ShieldCheck size={14} style={{ color: 'var(--champagne)' }} />
              Atención 100% privada previa cita en Miraflores. Discreción absoluta.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
