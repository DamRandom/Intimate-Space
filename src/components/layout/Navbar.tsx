'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, MessageCircle, Clock, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '@/data/brand';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const links = [
    { label: 'Filosofía', href: '/#filosofia' },
    { label: 'Terapeutas', href: '/#equipo' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Reservas', href: '/#reservas' },
    { label: 'Contacto', href: '/#contacto' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="zen-header">
      <div className="container zen-nav-content">
        <Link href="/" className="zen-brand" onClick={() => setIsOpen(false)}>
          <div className="zen-logo-text">
            <span className="zen-logo-espacio">ESPACIO</span>
            <span className="zen-logo-intimo">ÍNTIMO</span>
            <span className="zen-logo-luxury">Luxury Experience</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="zen-links" aria-label="Navegación principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="zen-nav-item">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="zen-nav-reserve">
          <Link href="/#reservas" className="btn-zen">
            Reservar Cita
          </Link>
        </div>

        {/* Mobile Toggle Button (min 44px tap target) */}
        <button
          type="button"
          className="zen-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer / Overlay */}
      {isOpen && (
        <div className="zen-mobile-menu-overlay" onClick={() => setIsOpen(false)}>
          <div 
            className="zen-mobile-menu-drawer" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            {/* Header inside drawer */}
            <div className="zen-mobile-drawer-header">
              <div className="zen-logo-text">
                <span className="zen-logo-espacio">ESPACIO</span>
                <span className="zen-logo-intimo">ÍNTIMO</span>
                <span className="zen-logo-luxury">Luxury Experience</span>
              </div>
              <button
                type="button"
                className="zen-mobile-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={22} />
              </button>
            </div>

            {/* Navigation items */}
            <nav className="zen-mobile-nav-list">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="zen-mobile-nav-link"
                  onClick={handleLinkClick}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={16} className="zen-mobile-link-arrow" />
                </Link>
              ))}
            </nav>

            {/* Quick Actions & Concierge info */}
            <div className="zen-mobile-drawer-footer">
              <Link
                href="/#reservas"
                className="btn-zen-filled zen-mobile-cta"
                onClick={handleLinkClick}
              >
                <Sparkles size={16} />
                Reservar Sesión Privada
              </Link>

              <a
                href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="zen-mobile-wa-btn"
                onClick={handleLinkClick}
              >
                <MessageCircle size={16} />
                <span>WhatsApp: {BRAND_CONFIG.contact.whatsapp}</span>
              </a>

              <div className="zen-mobile-schedule-pill">
                <Clock size={13} />
                <span>Atención: {BRAND_CONFIG.contact.hours}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
