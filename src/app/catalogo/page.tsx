'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { Service } from '@/types';

export default function CatalogoPage() {
  return (
    <div className="site-wrapper">
      <Navbar />

      <main>
        <section className="cat-page-header">
          <div className="container">
            <span className="section-label">Miraflores, Lima</span>
            <h1 className="cat-page-title">Catálogo de Masajes</h1>
            <p className="cat-page-sub">Precios con descuento aplican con tarjeta de crédito o primera visita.</p>
          </div>
        </section>

        <section className="cat-list-section">
          <div className="container">
            <div className="cat-list">
              {SERVICES_DATA.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
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
      {/* Image */}
      <div className="cat-card-media">
        <Image
          src={service.image}
          alt={service.name}
          width={480}
          height={360}
          className="cat-card-img"
          unoptimized
        />
        <span className="cat-card-num">{num}</span>
        <span className="cat-card-tag-badge">{service.tag}</span>
      </div>

      {/* Body */}
      <div className="cat-card-body">
        <h2 className="cat-card-name">{service.name}</h2>
        <p className="cat-card-desc">{service.description}</p>

        {/* Prices */}
        <div className="cat-prices">
          {service.prices.map((p, i) => (
            <div key={i} className="cat-price-row">
              <div className="cat-price-duration">
                <Clock size={12} />
                <span>{p.duration}</span>
              </div>
              <div className="cat-price-values">
                <span className="cat-price-regular">S/ {p.regular}</span>
                <span className="cat-price-sep">→</span>
                <span className="cat-price-discount">S/ {p.discount}</span>
                <span className="cat-price-label">con desc.</span>
              </div>
            </div>
          ))}
        </div>

        <Link href="/#reservas" className="cat-reserve-btn">
          Reservar
        </Link>
      </div>
    </article>
  );
}
