import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/data/brand';

export const Footer: React.FC = () => {
  return (
    <footer id="contacto" className="zen-simple-footer">
      <div className="container zen-simple-footer-inner">
        {/* Logo */}
        <Link href="/" className="zen-footer-logo-link">
          <div className="zen-logo-text">
            <span className="zen-logo-espacio">ESPACIO</span>
            <span className="zen-logo-intimo">ÍNTIMO</span>
            <span className="zen-logo-luxury">Luxury Experience</span>
          </div>
        </Link>

        {/* Redes Sociales */}
        <div className="zen-simple-footer-socials">
          <a
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="zen-simple-social-link"
          >
            WhatsApp
          </a>
          <span className="zen-simple-social-sep">·</span>
          <a
            href={BRAND_CONFIG.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="zen-simple-social-link"
          >
            Instagram
          </a>
        </div>

        {/* Derechos */}
        <p className="zen-simple-footer-copy">
          © {new Date().getFullYear()} ESPACIO ÍNTIMO. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};


