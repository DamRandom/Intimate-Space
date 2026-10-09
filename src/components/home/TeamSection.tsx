'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Sparkles, Check, ChevronRight } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  age: number;
  height: string;
  orientation: string;
  sexualRole: string;
  bio: string;
  image: string;
}

const TEAM_DATA: TeamMember[] = [
  {
    id: 'alver',
    name: 'Alver',
    specialty: 'Masaje Terapéutico Profundo',
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
    specialty: 'Masaje Sensitivo & Ritual',
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
    specialty: 'Reflexología & Termoterapia',
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
    specialty: 'Sueco & Descontracturante',
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

  const handleBookWithMember = (member: TeamMember) => {
    setSelectedMember(null);
    const bookingSection = document.getElementById('reservas');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="equipo" className="section-zen team-section">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Nuestro Equipo</span>
          <h2 className="section-heading">Manos que Transforman</h2>
          <p className="section-subtext">
            Terapeutas masculinos dedicados al arte del bienestar corporal. Compara sus especialidades y encuentra la conexión perfecta.
          </p>
        </div>

        {/* Grid de Terapeutas: 4 columnas en Desktop, 2x2 ordenado en móvil */}
        <div className="team-grid">
          {TEAM_DATA.map((member) => (
            <article
              key={member.id}
              className={`team-card ${selectedMember?.id === member.id ? 'team-card--active' : ''}`}
              onClick={() => setSelectedMember(member)}
            >
              <div className="team-card-media">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={420}
                  height={560}
                  className="team-card-img"
                  loading="lazy"
                />
                <span className="team-card-badge">{member.experience}</span>
              </div>

              <div className="team-card-body">
                <div className="team-card-header">
                  <h3 className="team-card-name">{member.name}</h3>
                </div>

                <p className="team-card-specialty">{member.specialty}</p>

                <button
                  type="button"
                  className="team-card-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMember(member);
                  }}
                  aria-label={`Ver perfil de ${member.name}`}
                >
                  <span>Conocer más</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="team-footer-note">
          <p>
            Atención en suites privadas individuales con <strong>total discreción y respeto</strong> en Miraflores.
          </p>
        </div>
      </div>

      {/* Modal / Bottom Sheet para comparar y ver la ficha del terapeuta */}
      {selectedMember && (
        <div 
          className="team-modal-backdrop" 
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Ficha de ${selectedMember.name}`}
        >
          <div 
            className="team-modal-sheet" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="team-modal-header">
              <span className="team-modal-tag">Ficha del Terapeuta</span>
              <button
                type="button"
                className="team-modal-close"
                onClick={() => setSelectedMember(null)}
                aria-label="Cerrar ficha"
              >
                <X size={20} />
              </button>
            </div>

            {/* Selector rápido para comparar entre terapeutas sin salir */}
            <div className="team-compare-bar" aria-label="Cambiar de terapeuta">
              {TEAM_DATA.map((m) => {
                const isActive = m.id === selectedMember.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`team-compare-chip ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSelectedMember(m)}
                  >
                    <span>{m.name}</span>
                    {isActive && <Check size={12} />}
                  </button>
                );
              })}
            </div>

            {/* Contenido de la ficha */}
            <div className="team-modal-content">
              <div className="team-modal-profile">
                <div className="team-modal-avatar">
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    width={180}
                    height={220}
                    className="team-modal-avatar-img"
                  />
                  <span className="team-modal-exp-badge">{selectedMember.experience} de exp.</span>
                </div>

                <div className="team-modal-titles">
                  <h3 className="team-modal-name">{selectedMember.name}</h3>
                  <p className="team-modal-specialty">{selectedMember.specialty}</p>
                </div>
              </div>

              {/* Grid 2x2 de métricas para comparar */}
              <div className="team-modal-metrics">
                <div className="team-metric-box">
                  <span className="team-metric-label">Edad</span>
                  <span className="team-metric-value">{selectedMember.age} años</span>
                </div>
                <div className="team-metric-box">
                  <span className="team-metric-label">Estatura</span>
                  <span className="team-metric-value">{selectedMember.height}</span>
                </div>
                <div className="team-metric-box">
                  <span className="team-metric-label">Orientación</span>
                  <span className="team-metric-value">{selectedMember.orientation}</span>
                </div>
                <div className="team-metric-box">
                  <span className="team-metric-label">Rol</span>
                  <span className="team-metric-value">{selectedMember.sexualRole}</span>
                </div>
              </div>

              {/* Biografía y estilo de sesión */}
              <div className="team-modal-bio-box">
                <h4 className="team-modal-bio-title">Estilo de sesión</h4>
                <p className="team-modal-bio-text">{selectedMember.bio}</p>
              </div>

              {/* Botón de acción hacia el formulario */}
              <div className="team-modal-actions">
                <button
                  type="button"
                  className="btn-zen-filled"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => handleBookWithMember(selectedMember)}
                >
                  <Sparkles size={16} />
                  Solicitar Cita con {selectedMember.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
