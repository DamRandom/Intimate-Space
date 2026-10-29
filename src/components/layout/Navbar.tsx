'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

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
    { label: 'Contacto', href: '/#contacto' },
  ];

  // Conmutador para ocultar login/panel temporalmente sin perder el código
  const SHOW_AUTH_LINKS = false;

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

        {/* Desktop Links with ample breathing room */}
        <nav className="zen-links" aria-label="Navegación principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="zen-nav-item">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions: Single elegant button (Login/Cuenta en pausa en la UI) */}
        <div className="zen-nav-actions">
          {SHOW_AUTH_LINKS && (
            user ? (
              <Link 
                href={user.role === 'admin' ? '/admin' : '/mi-cuenta'} 
                className="zen-nav-subtle-link"
              >
                {user.role === 'admin' ? 'Conserjería' : 'Mi Cuenta'}
              </Link>
            ) : (
              <Link href="/login" className="zen-nav-subtle-link">
                Acceso
              </Link>
            )
          )}

          <Link href="/#reservas" className="btn-zen-nav">
            Reservar
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="zen-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            <div className="zen-mobile-drawer-header">
              <div className="zen-logo-text">
                <span className="zen-logo-espacio">ESPACIO</span>
                <span className="zen-logo-intimo">ÍNTIMO</span>
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
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {SHOW_AUTH_LINKS && (
                <Link
                  href={user ? (user.role === 'admin' ? '/admin' : '/mi-cuenta') : '/login'}
                  className="zen-mobile-nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {user ? (user.role === 'admin' ? 'Conserjería Central' : 'Mi Cuenta Privada') : 'Acceso de Socios'}
                </Link>
              )}
            </nav>

            <div className="zen-mobile-drawer-footer">
              <Link
                href="/#reservas"
                className="btn-zen-filled"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={() => setIsOpen(false)}
              >
                Reservar Cita
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

