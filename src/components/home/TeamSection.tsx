'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Sparkles, Check, ChevronRight, Calendar, MessageCircle, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG } from '@/data/brand';

export interface TeamMember {
  id: string;
  name: string;
  experience: string;
  age: number;
  height: string;
  orientation: string;
  sexualRole: string;
  bio: string;
  image: string;
}

export const TEAM_DATA: TeamMember[] = [
  {
    id: 'alver',
    name: 'Alver',
    experience: '8 años',
    age: 29,
    height: '1.76 m',
    orientation: 'Gay',
    sexualRole: 'Versátil',
    bio: 'Manos firmes y presencia calmada. Alver trabaja con atención plena en cada punto del cuerpo, logrando una relajación profunda que va más allá de lo muscular.',
    image: '/terapeutas/alver.jpeg',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    experience: '6 años',
    age: 31,
    height: '1.80 m',
    orientation: 'Bisexual',
    sexualRole: 'Activo',
    bio: 'Carlos combina técnica y sensualidad en cada sesión. Su energía es cálida y envolvente, ideal para quienes buscan una experiencia de conexión total.',
    image: '/terapeutas/carlos.jpeg',
  },
  {
    id: 'glanko',
    name: 'Glanko',
    experience: '5 años',
    age: 27,
    height: '1.74 m',
    orientation: 'Gay',
    sexualRole: 'Pasivo',
    bio: 'Glanko tiene una sensibilidad especial para leer el cuerpo y adaptarse a lo que cada cliente necesita. Su toque es preciso, relajante y completamente presente.',
    image: '/terapeutas/glanko.jpeg',
  },
  {
    id: 'raul',
    name: 'Raul',
    experience: '4 años',
    age: 26,
    height: '1.78 m',
    orientation: 'Bisexual',
    sexualRole: 'Versátil activo',
    bio: 'Raul transmite calma desde el primer contacto. Especializado en liberar tensiones acumuladas con maniobras suaves pero efectivas que dejan el cuerpo liviano.',
    image: '/terapeutas/raul.jpeg',
  },
];

export const TeamSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Prevent background scroll when modal comparison sheet is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBookWithMember = (member: TeamMember) => {
    setSelectedMember(null);
    const bookingSection = document.getElementById('reservas');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getWhatsappUrl = (member: TeamMember) => {
    const message = encodeURIComponent(
      `Hola Espacio Íntimo, deseo consultar disponibilidad para una sesión con el terapeuta ${member.name}.`
    );
    return `https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}?text=${message}`;
  };

  return (
    <section id="equipo" className="section-zen team-section">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Nuestro Equipo</span>
          <h2 className="section-heading">Manos que Transforman</h2>
          <p className="section-subtext">
            Terapeutas masculinos dedicados al arte del bienestar y la desconexión total. Conoce sus perfiles y elige con quién deseas vivir tu experiencia.
          </p>
        </div>

        {/* Grid de Terapeutas: 4 columnas en Desktop, 2x2 ordenado y elegante en móvil */}
        <div className="team-grid">
          {TEAM_DATA.map((member) => (
            <article
              key={member.id}
              className={`team-card ${selectedMember?.id === member.id ? 'team-card--active' : ''}`}
              onClick={() => setSelectedMember(member)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedMember(member);
                }
              }}
              aria-label={`Ver perfil de ${member.name}`}
            >
              <div className="team-card-media">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={460}
                  height={620}
                  className="team-card-img"
                  loading="lazy"
                />

                {/* Overlays y badges de estado y experiencia */}
                <div className="team-card-badges-top">
                  <span className="team-card-badge-status">
                    <span className="team-status-dot" />
                    Disponible
                  </span>
                  <span className="team-card-badge-exp">{member.experience}</span>
                </div>

                <div className="team-card-media-fade" />
              </div>

              <div className="team-card-body">
                <div className="team-card-header">
                  <h3 className="team-card-name">{member.name}</h3>
                  <span className="team-card-subtitle">Terapeuta</span>
                </div>

                {/* Chips de características físicas limpias y ordenadas */}
                <div className="team-card-stats-row">
                  <span className="team-card-stat-pill">{member.age} años</span>
                  <span className="team-card-stat-pill">{member.height}</span>
                  <span className="team-card-stat-pill">{member.sexualRole}</span>
                </div>

                {/* Botón de acción con estilo editorial */}
                <div className="team-card-action">
                  <span>Conocer más</span>
                  <div className="team-card-action-icon">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="team-footer-note">
          <p>
            Atención en suites privadas individuales con <strong>total discreción y confort</strong> en Miraflores.
          </p>
        </div>
      </div>

      {/* Modal Dossier de Lujo para conocer más y comparar terapeutas */}
      {selectedMember && (
        <div 
          className="team-modal-backdrop" 
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
        >
          <div 
            className="team-modal-container" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cierre elegante */}
            <button
              type="button"
              className="team-modal-close-btn"
              onClick={() => setSelectedMember(null)}
              aria-label="Cerrar ficha"
            >
              <X size={20} />
            </button>

            {/* Layout en 2 columnas: Retrato editorial a la izquierda + Ficha a la derecha */}
            <div className="team-modal-layout">
              {/* Columna Izquierda: Retrato */}
              <div className="team-modal-photo-col">
                <Image
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  width={600}
                  height={800}
                  className="team-modal-portrait-img"
                  priority
                />
                
                <div className="team-modal-photo-gradient" />

                <div className="team-modal-photo-badges">
                  <span className="team-modal-verified-tag">
                    <Sparkles size={12} />
                    Terapeuta Verificado
                  </span>
                  <span className="team-modal-exp-tag">
                    {selectedMember.experience} de experiencia
                  </span>
                </div>

                <div className="team-modal-photo-caption">
                  <p>Miraflores • Suites Privadas</p>
                </div>
              </div>

              {/* Columna Derecha: Información, Switcher y Acciones */}
              <div className="team-modal-info-col">
                {/* Selector rápido entre terapeutas */}
                <div className="team-modal-switcher" aria-label="Cambiar de terapeuta">
                  <span className="team-modal-switcher-label">Terapeutas:</span>
                  <div className="team-modal-chips-track">
                    {TEAM_DATA.map((m) => {
                      const isActive = m.id === selectedMember.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          className={`team-switcher-chip ${isActive ? 'is-active' : ''}`}
                          onClick={() => setSelectedMember(m)}
                        >
                          <span className="team-switcher-chip-avatar">
                            <Image
                              src={m.image}
                              alt={m.name}
                              width={24}
                              height={24}
                              className="team-switcher-chip-img"
                            />
                          </span>
                          <span className="team-switcher-chip-name">{m.name}</span>
                          {isActive && <Check size={12} className="team-switcher-chip-check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Encabezado del Terapeuta */}
                <div className="team-modal-bio-header">
                  <span className="team-modal-kicker">FICHA PRIVADA</span>
                  <h3 id="team-modal-title" className="team-modal-name">
                    {selectedMember.name}
                  </h3>
                  <p className="team-modal-subtitle">
                    Terapeuta Profesional • Espacio Íntimo
                  </p>
                </div>

                {/* Métricas / Dossier Físico */}
                <div className="team-modal-metrics-grid">
                  <div className="team-modal-metric-card">
                    <span className="team-metric-label">Edad</span>
                    <span className="team-metric-val">{selectedMember.age} años</span>
                  </div>
                  <div className="team-modal-metric-card">
                    <span className="team-metric-label">Estatura</span>
                    <span className="team-metric-val">{selectedMember.height}</span>
                  </div>
                  <div className="team-modal-metric-card">
                    <span className="team-metric-label">Orientación</span>
                    <span className="team-metric-val">{selectedMember.orientation}</span>
                  </div>
                  <div className="team-modal-metric-card">
                    <span className="team-metric-label">Rol</span>
                    <span className="team-metric-val">{selectedMember.sexualRole}</span>
                  </div>
                </div>

                {/* Estilo y enfoque de atención */}
                <div className="team-modal-bio-card">
                  <div className="team-modal-bio-tagline">
                    <Sparkles size={14} className="champagne-icon" />
                    <span>Estilo de Sesión</span>
                  </div>
                  <p className="team-modal-bio-text">
                    &ldquo;{selectedMember.bio}&rdquo;
                  </p>
                </div>

                {/* Nota de garantía de discreción y técnicas */}
                <div className="team-modal-assurance">
                  <ShieldCheck size={16} className="champagne-icon" />
                  <p>
                    Capacitado en todas las terapias de nuestra carta exclusiva (Sensitivo, Descontracturante, Ritual Cuatro Manos y más).
                  </p>
                </div>

                {/* Botones de acción coordinada */}
                <div className="team-modal-actions-row">
                  <button
                    type="button"
                    className="btn-zen-filled team-modal-primary-btn"
                    onClick={() => handleBookWithMember(selectedMember)}
                  >
                    <Calendar size={16} />
                    <span>Solicitar Cita con {selectedMember.name}</span>
                  </button>

                  <a
                    href={getWhatsappUrl(selectedMember)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-zen-outline team-modal-wa-btn"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
