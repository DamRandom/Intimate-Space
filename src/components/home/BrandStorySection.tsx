'use client';

import React from 'react';
import Image from 'next/image';
import { BRAND_TENETS } from '@/data/brand';

export const BrandStorySection: React.FC = () => {
  return (
    <section id="filosofia" className="section-zen">
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
              Un espacio privado concebido para hombres que enfrentan la exigencia cotidiana y comprenden el valor de la calma.
            </p>

            {/* Mobile visual highlight (shows right after lead on mobile screens) */}
            <div className="zen-story-img-mobile">
              <Image
                src="/assets/ritual_inti.jpg"
                alt="Ritual Inti en Espacio Íntimo"
                width={600}
                height={400}
                className="zen-story-img"
              />
            </div>

            <p className="zen-story-body">
              Tomamos la energía renovadora del Sol como principio para diseñar sesiones que disuelven la tensión muscular acumulada, restaurando el balance corporal y mental a través de un trato profesional, cálido y confidencial.
            </p>

            {/* 4 Quiet Tenets Grid 2x2 */}
            <div className="zen-story-pillars">
              {BRAND_TENETS.map((tenet, idx) => (
                <div key={idx} className="zen-pillar-item">
                  <span className="zen-pillar-num">0{idx + 1}</span>
                  <h4 className="zen-pillar-title">{tenet.title}</h4>
                  <p className="zen-pillar-desc">{tenet.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image (Desktop) */}
          <div className="zen-story-img-desktop">
            <div className="zen-story-img-wrapper">
              <Image
                src="/assets/ritual_inti.jpg"
                alt="Ritual Inti en Espacio Íntimo"
                width={600}
                height={700}
                className="zen-story-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
