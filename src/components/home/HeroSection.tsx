import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="zen-hero">
      {/* Background ambient lighting effects */}
      <div className="zen-hero-ambient-orb orb-1" />
      <div className="zen-hero-ambient-orb orb-2" />
      <div className="zen-hero-texture-overlay" />

      <div className="container zen-hero-container">
        <div className="zen-hero-inner">

          {/* Luxury Eyebrow Pill */}
          <div className="zen-hero-badge-wrap">
            <span className="zen-hero-kicker">
              <span className="zen-kicker-dot" />
              <span>Santuario de Bienestar Masculino • Miraflores, Lima</span>
            </span>
          </div>

          {/* Main Title with subtle luxury gradient */}
          <h1 className="zen-hero-title">
            <span className="zen-title-line">Pausa.</span>
            <span className="zen-title-line text-gradient-champagne">Respira.</span>
            <span className="zen-title-line">Recupérate.</span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="zen-hero-sub">
            Masajes terapéuticos, revitalización sensorial y ritual energético para hombres.
            <br className="hidden-mobile" />
            Atención en suites privadas con <strong>máxima discreción y confort</strong> en Miraflores.
          </p>

          {/* Action CTAs with shimmer */}
          <div className="zen-hero-actions">
            <a href="#reservas" className="btn-zen-filled zen-hero-cta-main">
              <span>Reservar Experiencia</span>
              <ArrowRight size={17} />
            </a>
            <Link href="/catalogo" className="btn-zen zen-hero-cta-secondary">
              <span>Explorar Catálogo</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
