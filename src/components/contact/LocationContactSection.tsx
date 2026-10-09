import React from 'react';
import { BRAND_CONFIG } from '@/data/brand';

export const LocationContactSection: React.FC = () => {
  return (
    <section id="contacto" className="section-zen">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Ubicación & Contacto</span>
          <h2 className="section-heading">Atención Privada en Miraflores</h2>
          <p className="section-subtext">
            Un espacio reservado en una zona céntrica y apacible de Miraflores, Lima.
          </p>
        </div>

        <div className="zen-contact-row">
          <div className="zen-contact-item">
            <span className="zen-contact-title">Distrito</span>
            <p className="zen-contact-value">Miraflores, Lima</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Dirección exacta compartida al confirmar reserva.
            </p>
          </div>

          <div className="zen-contact-item">
            <span className="zen-contact-title">Canales Oficiales</span>
            <p className="zen-contact-value">
              <a href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`} target="_blank" rel="noopener noreferrer">
                {BRAND_CONFIG.contact.whatsapp}
              </a>
            </p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.4rem' }}>
              <a
                href={BRAND_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--champagne)' }}
              >
                {BRAND_CONFIG.contact.instagramHandle}
              </a>
            </p>
          </div>

          <div className="zen-contact-item">
            <span className="zen-contact-title">Atención</span>
            <p className="zen-contact-value">10:00 a 22:00</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Lunes a Domingo • Exclusivamente previa cita.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
