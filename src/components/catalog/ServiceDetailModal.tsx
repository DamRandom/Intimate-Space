import React from 'react';
import { X, Clock } from 'lucide-react';
import { Service } from '@/types';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
  onBookNow: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookNow
}) => {
  if (!service) return null;

  return (
    <div className="zen-modal-backdrop" onClick={onClose}>
      <div className="zen-modal-window" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="zen-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={22} />
        </button>

        <span className="zen-modal-tag">{service.tag}</span>
        <h2 className="zen-modal-title">{service.name}</h2>
        <p className="zen-modal-desc">{service.description}</p>

        <div className="zen-modal-block">
          <h4 className="zen-modal-block-title">Precios</h4>
          <ul className="zen-protocol-steps">
            {service.prices.map((p, idx) => (
              <li key={idx} className="zen-protocol-item">
                <span className="zen-step-dot"><Clock size={12} /></span>
                <span>{p.duration} — Regular S/ {p.regular} · Con desc. S/ {p.discount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="zen-modal-actions">
          <button type="button" className="btn-zen" onClick={onClose}>
            Cerrar
          </button>
          <button
            type="button"
            className="btn-zen-filled"
            onClick={() => {
              onClose();
              onBookNow(service);
            }}
          >
            Reservar Experiencia
          </button>
        </div>
      </div>
    </div>
  );
};
