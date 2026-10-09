import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  onOpenDetails: (service: Service) => void;
  onSelectServiceForBooking: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onOpenDetails,
  onSelectServiceForBooking
}) => {
  return (
    <article className="zen-card">
      <div className="zen-card-media">
        <Image
          src={service.image}
          alt={service.name}
          width={500}
          height={320}
          className="zen-card-img"
        />
      </div>

      <div className="zen-card-body">
        <span className="zen-card-tag">{service.tag}</span>
        <h3 className="zen-card-title">{service.name}</h3>
        <p className="zen-card-desc">{service.description}</p>

        <div className="zen-card-footer">
          <span className="zen-duration">{service.prices[0].duration}</span>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-zen-subtle"
              onClick={() => onOpenDetails(service)}
            >
              Protocolo
            </button>

            <button
              type="button"
              className="btn-zen"
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.74rem' }}
              onClick={() => onSelectServiceForBooking(service)}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
