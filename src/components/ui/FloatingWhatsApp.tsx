import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '@/data/brand';

export const FloatingWhatsApp: React.FC = () => {
  const defaultMessage = encodeURIComponent(
    'Hola Espacio Íntimo 🍃, deseo consultar disponibilidad para una sesión privada en Miraflores.'
  );

  return (
    <aside aria-label="Contacto WhatsApp">
      <a
        href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="zen-floating-wa"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={18} />
        <span>WhatsApp Concierge</span>
      </a>
    </aside>
  );
};
