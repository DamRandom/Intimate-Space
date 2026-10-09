'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/data/brand';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  ChevronUp, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const InstagramIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contacto" className="zen-footer">
      <div className="container">
        {/* Main Grid */}
        <div className="zen-footer-grid">
          {/* Brand Column */}
          <div className="zen-footer-col zen-footer-brand-col">
            <Link href="/" className="zen-footer-logo-link">
              <div className="zen-logo-text">
                <span className="zen-logo-espacio">ESPACIO</span>
                <span className="zen-logo-intimo">ÍNTIMO</span>
                <span className="zen-logo-luxury">Luxury Experience</span>
              </div>
            </Link>

            <p className="zen-footer-about">
              Masajes terapéuticos y rituales de bienestar concebidos exclusivamente para hombres. Manos expertas, calma y discreción absoluta.
            </p>

            <div className="zen-footer-badges">
              <span className="zen-footer-pill">
                <Sparkles size={11} /> Men for Men
              </span>
              <span className="zen-footer-pill">
                <ShieldCheck size={11} /> 100% Privado
              </span>
              <span className="zen-footer-pill">
                <MapPin size={11} /> Miraflores
              </span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="zen-footer-col">
            <h5 className="zen-footer-col-title">Navegación</h5>
            <ul className="zen-footer-links">
              <li>
                <Link href="#filosofia" className="zen-footer-link">
                  Filosofía & Ritual
                </Link>
              </li>
              <li>
                <Link href="#terapeutas" className="zen-footer-link">
                  Nuestros Terapeutas
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="zen-footer-link">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="#reservas" className="zen-footer-link">
                  Reservar Sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="zen-footer-col">
            <h5 className="zen-footer-col-title">Canales Oficiales</h5>
            <ul className="zen-footer-contact-list">
              <li>
                <a
                  href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="zen-footer-contact-item"
                >
                  <div className="zen-footer-icon-box">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <span className="zen-footer-contact-label">WhatsApp Privado</span>
                    <span className="zen-footer-contact-value">
                      {BRAND_CONFIG.contact.whatsapp}
                      <ArrowUpRight size={12} className="zen-footer-arrow" />
                    </span>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={BRAND_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="zen-footer-contact-item"
                >
                  <div className="zen-footer-icon-box">
                    <InstagramIcon size={16} />
                  </div>
                  <div>
                    <span className="zen-footer-contact-label">Instagram Oficial</span>
                    <span className="zen-footer-contact-value">
                      {BRAND_CONFIG.contact.instagramHandle}
                      <ArrowUpRight size={12} className="zen-footer-arrow" />
                    </span>
                  </div>
                </a>
              </li>

              <li className="zen-footer-contact-item">
                <div className="zen-footer-icon-box">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="zen-footer-contact-label">Ubicación</span>
                  <span className="zen-footer-contact-value">Miraflores, Lima</span>
                  <span className="zen-footer-subtext">Dirección exacta compartida al confirmar.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours & Access Column */}
          <div className="zen-footer-col">
            <h5 className="zen-footer-col-title">Atención & Acceso</h5>
            <div className="zen-footer-card">
              <div className="zen-footer-card-header">
                <Clock size={15} style={{ color: 'var(--champagne)' }} />
                <span>Horario de Atención</span>
              </div>
              <p className="zen-footer-card-value">Lunes a Domingo</p>
              <p className="zen-footer-card-hours">10:00 a 22:00 hrs</p>
              
              <div className="zen-footer-card-divider" />
              
              <div className="zen-footer-card-header">
                <ShieldCheck size={15} style={{ color: 'var(--champagne)' }} />
                <span>Política de Discreción</span>
              </div>
              <p className="zen-footer-subtext">
                Atención exclusivamente previa cita para garantizar la calma de cada huésped.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="zen-footer-divider" />

        {/* Bottom Bar */}
        <div className="zen-footer-bottom">
          <p className="zen-footer-copy">
            © {new Date().getFullYear()} ESPACIO ÍNTIMO Luxury Experience. Todos los derechos reservados.
          </p>

          <p className="zen-footer-origin">
            Miraflores, Lima • Men for Men Wellness
          </p>

          <button 
            type="button" 
            onClick={scrollToTop} 
            className="zen-footer-backtotop"
            aria-label="Volver al inicio"
          >
            <span>Subir</span>
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
