'use client';

import React, { useState } from 'react';
import { SERVICES_DATA } from '@/data/services';
import { Service } from '@/types';
import { ServiceCard } from './ServiceCard';
import { ServiceDetailModal } from './ServiceDetailModal';

interface CatalogSectionProps {
  onSelectServiceForBooking: (service: Service) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onSelectServiceForBooking
}) => {
  const [activeModalService, setActiveModalService] = useState<Service | null>(null);

  return (
    <section id="experiencias" className="section-zen">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Catálogo de Bienestar</span>
          <h2 className="section-heading">Nuestras Experiencias</h2>
          <p className="section-subtext">
            Tres rituales diseñados meticulosamente con insumos botánicos propios, calor terapéutico y maniobras expertas.
          </p>
        </div>

        <div className="zen-catalog-grid">
          {SERVICES_DATA.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpenDetails={(s) => setActiveModalService(s)}
              onSelectServiceForBooking={onSelectServiceForBooking}
            />
          ))}
        </div>

        <ServiceDetailModal
          service={activeModalService}
          onClose={() => setActiveModalService(null)}
          onBookNow={onSelectServiceForBooking}
        />
      </div>
    </section>
  );
};
