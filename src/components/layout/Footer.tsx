'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/data/brand';
import { 
  MessageCircle, 
  ChevronUp, 
  Clock, 
  MapPin,
  ArrowUpRight 
} from 'lucide-react';

const InstagramIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
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
    <footer id="contacto" className="zen-footer-compact">
      <div className="container">
        {/* Brand Header */}
        <div className="zen-footer-brand-wrap">
          <Link href="/" className="zen-footer-logo-link">
            <div className="zen-logo-text">
              <span className="zen-logo-espacio">ESPACIO</span>
              <span className="zen-logo-intimo">ÍNTIMO</span>
              <span className="zen-logo-luxury">Luxury Experience</span>
            </div>
          </Link>
          <span className="zen-footer-tagline">
            Men for Men • Miraflores, Lima
          </span>
        </div>

        {/* Quick Links in Horizontal Bar */}
        <nav className="zen-footer-nav-row" aria-label="Navegación pie de página">
          <Link href="/#filosofia" className="zen-footer-nav-link">Filosofía</Link>
          <span className="zen-footer-nav-sep">·</span>
          <Link href="/#equipo" className="zen-footer-nav-link">Terapeutas</Link>
          <span className="zen-footer-nav-sep">·</span>
          <Link href="/catalogo" className="zen-footer-nav-link">Catálogo</Link>
          <span className="zen-footer-nav-sep">·</span>
          <Link href="/#reservas" className="zen-footer-nav-link">Reservas</Link>
        </nav>

        {/* Contact Channels Compact Pills */}
        <div className="zen-footer-channels-row">
          <a
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="zen-footer-channel-pill"
          >
            <MessageCircle size={14} style={{ color: 'var(--champagne)' }} />
            <span>WhatsApp {BRAND_CONFIG.contact.whatsapp}</span>
            <ArrowUpRight size={12} className="zen-footer-arrow-icon" />
          </a>

          <a
            href={BRAND_CONFIG.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="zen-footer-channel-pill"
          >
            <InstagramIcon size={14} />
            <span>{BRAND_CONFIG.contact.instagramHandle}</span>
            <ArrowUpRight size={12} className="zen-footer-arrow-icon" />
          </a>

          <div className="zen-footer-info-pill">
            <MapPin size={13} style={{ color: 'var(--champagne)' }} />
            <span>Miraflores · Cita privada</span>
          </div>

          <div className="zen-footer-info-pill">
            <Clock size={13} style={{ color: 'var(--champagne)' }} />
            <span>10:00 - 22:00</span>
          </div>
        </div>

        {/* Divider */}
        <div className="zen-footer-compact-divider" />

        {/* Bottom Bar */}
        <div className="zen-footer-bottom-row">
          <p className="zen-footer-compact-copy">
            © {new Date().getFullYear()} ESPACIO ÍNTIMO. Todos los derechos reservados.
          </p>

          <button 
            type="button" 
            onClick={scrollToTop} 
            className="zen-footer-backtotop-btn"
            aria-label="Volver al inicio"
          >
            <span>Subir</span>
            <ChevronUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};
