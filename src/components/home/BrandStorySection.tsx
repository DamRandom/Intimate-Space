import React from 'react';
import Image from 'next/image';
import { BRAND_TENETS } from '@/data/brand';

export const BrandStorySection: React.FC = () => {
  return (
    <section id="filosofia" className="section-zen zen-story-section">
      <div className="zen-story-ambient-glow" />

      <div className="container">
        <div className="zen-story-grid">
          {/* Left Text */}
          <div className="zen-story-text">
            <div className="zen-story-header">
              <span className="section-label">Nuestra Filosofía</span>
              <h2 className="section-heading">
                Inspirado en el Ritual del Inti
              </h2>
            </div>

            <p className="zen-story-lead">
              Un espacio privado concebido para hombres que enfrentan la exigencia cotidiana y comprenden el valor inestimable de la calma.
            </p>

            {/* Mobile visual highlight (shows right after lead on mobile screens) */}
            <div className="zen-story-img-mobile">
              <div className="zen-story-img-frame">
                <Image
                  src="/assets/ritual_inti.jpg"
                  alt="Ritual Inti en Espacio Íntimo"
                  width={600}
                  height={400}
                  className="zen-story-img"
                />
                <div className="zen-img-badge-overlay">
                  <span>Ritual INTI • Firma de la Casa</span>
                </div>
              </div>
            </div>

            <p className="zen-story-body">
              Tomamos la energía renovadora del Sol como principio para diseñar sesiones que disuelven la tensión muscular acumulada, restaurando el balance corporal y mental a través de un trato profesional, cálido y confidencial.
            </p>

            {/* Editorial quote */}
            <blockquote className="zen-story-quote">
              <span className="quote-mark">“</span>
              <p>El verdadero lujo contemporáneo reside en el tiempo y el espacio consagrados a recuperar tu propia vitalidad.</p>
            </blockquote>

            {/* 4 Quiet Tenets Grid 2x2 with luxury cards */}
            <div className="zen-story-pillars">
              {BRAND_TENETS.map((tenet, idx) => (
                <div key={idx} className="zen-pillar-item">
                  <h4 className="zen-pillar-title">{tenet.title}</h4>
                  <p className="zen-pillar-desc">{tenet.description}</p>
                  <div className="zen-pillar-hover-shine" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Image (Desktop) */}
          <div className="zen-story-img-desktop">
            <div className="zen-story-img-wrapper">
              <div className="zen-story-gold-border-decor" />
              <div className="zen-story-img-frame">
                <Image
                  src="/assets/ritual_inti.jpg"
                  alt="Ritual Inti en Espacio Íntimo"
                  width={600}
                  height={700}
                  className="zen-story-img"
                />
                <div className="zen-story-overlay-gradient" />
                <div className="zen-img-floating-caption">
                  <div>
                    <strong>Ritual Energético INTI</strong>
                    <span>Técnica de revitalización solar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
