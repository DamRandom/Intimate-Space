'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SERVICES_DATA } from '@/data/services';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { Service } from '@/types';

const CATEGORIES = [
  { key: 'all',          label: 'Todos' },
  { key: 'terapeutico',  label: 'Terapeuticos' },
  { key: 'relajacion',   label: 'Relajacion' },
  { key: 'deportivo',    label: 'Deportivo' },
  { key: 'sensorial',    label: 'Sensorial' },
];

export default function CatalogoPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredServices = SERVICES_DATA.filter((s) =>
    filterCategory === 'all' ? true : s.category === filterCategory
  );

  return (
    <div className="site-wrapper">
      <Navbar />
      <main className="cat-page-wrapper">

        {/* Ambient orbs */}
        <div className="cat-orb cat-orb-1" aria-hidden="true" />
        <div className="cat-orb cat-orb-2" aria-hidden="true" />

        {/* Header */}
        <section className="cat-header">
          <div className="container">
            <span className="section-label">Carta Exclusiva &middot; Miraflores, Lima</span>
            <h1 className="cat-title">Masajes &amp; Rituales</h1>
            <p className="cat-subtitle">
              Tratamientos diseñados para la anatomia y exigencias masculinas.
            </p>

            {/* Filter bar */}
            <div className="cat-filter-bar" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={filterCategory === cat.key}
                  className={`cat-filter-btn${filterCategory === cat.key ? ' active' : ''}`}
                  onClick={() => setFilterCategory(cat.key)}
                >
                  {cat.label}
                  {cat.key === 'all' && (
                    <span className="cat-filter-count">{SERVICES_DATA.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="cat-grid-section">
          <div className="container">
            <div className="cat-grid">
              {filteredServices.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Assurance strip */}
        <section className="cat-assurance-strip">
          <div className="container">
            <div className="cat-assurance-inner">
              <div className="cat-assurance-col">
                <div className="cat-assurance-icon-wrap" aria-hidden="true">
                  <span className="cat-assurance-dot" />
                </div>
                <div>
                  <h4>Suite 100% Privada</h4>
                  <p>Mesa ergonomica, climatizacion silenciosa y ducha en suite incluidas.</p>
                </div>
              </div>
              <div className="cat-assurance-col">
                <div className="cat-assurance-icon-wrap" aria-hidden="true">
                  <span className="cat-assurance-dot" />
                </div>
                <div>
                  <h4>Oleos Botanicos Calientes</h4>
                  <p>Formulas organicas con aromaterapia de cedro, sandalo y eucalipto.</p>
                </div>
              </div>
              <div className="cat-assurance-col">
                <div className="cat-assurance-icon-wrap" aria-hidden="true">
                  <span className="cat-assurance-dot" />
                </div>
                <div>
                  <h4>Reserva Anticipada</h4>
                  <p>Confirma tu cita con tiempo y disfruta de disponibilidad prioritaria.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <article className="cat-card">
      {/* Shine rim */}
      <div className="cat-card-rim" aria-hidden="true" />

      {/* Media */}
      <div className="cat-card-media">
        <Image
          src={service.image}
          alt={service.name}
          width={520}
          height={320}
          className="cat-card-img"
          unoptimized
        />
        <div className="cat-card-media-veil" />
        <span className="cat-card-num">{num}</span>
        <span className="cat-card-tag">{service.tag}</span>
      </div>

      {/* Body */}
      <div className="cat-card-body">
        <h2 className="cat-card-name">{service.name}</h2>
        <p className="cat-card-desc">{service.description}</p>

        {/* Prices */}
        <div className="cat-prices">
          {service.prices.map((p, i) => (
            <div key={i} className="cat-price-row">
              <span className="cat-price-duration">{p.duration}</span>
              <span className="cat-price-sep" aria-hidden="true" />
              <span className="cat-price-amount">S/ {p.price}</span>
            </div>
          ))}
        </div>

        <Link href="/#reservas" className="cat-reserve-btn">
          Solicitar Cita
        </Link>
      </div>
    </article>
  );
}
