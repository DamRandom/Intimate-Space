import React from 'react';
import { BRAND_CONFIG } from '@/data/brand';

export const LocationContactSection: React.FC = () => {
  return (
    <section id="contacto" className="section-zen zen-location-section">
      <div className="container relative z-10">
        <div className="text-center zen-contact-header">
          <span className="section-label">Ubicación & Contacto</span>
          <h2 className="section-heading">Atención Privada en Miraflores</h2>
          <p className="section-subtext">
            Un refugio reservado en una zona residencial serena y céntrica de Miraflores, Lima. Máxima confidencialidad y atención personalizada.
          </p>
        </div>

        <div className="zen-contact-cards-grid">
          {/* Card 1: Ubicación & Privacidad */}
          <div className="zen-contact-luxury-card">
            <span className="zen-contact-category">Ubicación Privada</span>
            <h3 className="zen-contact-card-title">Miraflores, Lima</h3>
            <p className="zen-contact-card-desc">
              Zona residencial exclusiva, de fácil acceso y con estacionamiento seguro cercano.
            </p>
            <div className="zen-contact-meta-pill">
              <span>Dirección exacta al confirmar cita</span>
            </div>
          </div>

          {/* Card 2: Concierge WhatsApp */}
          <div className="zen-contact-luxury-card highlighted">
            <div className="flex items-center justify-between">
              <span className="zen-contact-category">Canal Directo</span>
              <span className="zen-live-status">
                <span className="zen-live-dot" />
                Online
              </span>
            </div>
            <h3 className="zen-contact-card-title">Atención Personalizada</h3>
            <p className="zen-contact-card-desc">
              Resuelve dudas específicas y coordina tu turno directamente con nuestro concierge.
            </p>
            <div className="zen-contact-card-actions">
              <a
                href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="zen-contact-wa-btn"
              >
                <span>WhatsApp {BRAND_CONFIG.contact.whatsapp}</span>
              </a>
              <a
                href={BRAND_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="zen-contact-sub-link"
              >
                Instagram: {BRAND_CONFIG.contact.instagramHandle}
              </a>
            </div>
          </div>

          {/* Card 3: Horarios & Protocolo */}
          <div className="zen-contact-luxury-card">
            <span className="zen-contact-category">Horario de Atención</span>
            <h3 className="zen-contact-card-title">10:00 a 22:00</h3>
            <p className="zen-contact-card-desc">
              Lunes a Domingo, turnos continuos organizados para garantizar espacio y privacidad entre cada huésped.
            </p>
            <div className="zen-contact-meta-pill">
              <span>Exclusivamente previa cita coordinada</span>
            </div>
          </div>
        </div>

        {/* Assurance bottom note */}
        <div className="zen-contact-bottom-assurance">
          <div className="zen-assurance-text">
            <h4>Protocolo de Absoluta Discreción</h4>
            <p>
              No contamos con letreros exteriores ni recepciones concurridas. Tu privacidad y confort están protegidos en cada visita.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


