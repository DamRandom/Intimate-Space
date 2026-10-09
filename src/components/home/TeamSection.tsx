'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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
    specialty: 'Masaje Sueco & Descontracturante',
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
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="equipo" className="section-zen team-section">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Nuestro Equipo</span>
          <h2 className="section-heading">Manos que Transforman</h2>
          <p className="section-subtext">
            Terapeutas masculinos dedicados al arte del bienestar corporal. Cada sesión es única, guiada por experiencia, intuición y presencia absoluta.
          </p>
        </div>

        <div className="team-grid">
          {TEAM_DATA.map((member) => (
            <article
              key={member.id}
              className={`team-card ${activeId === member.id ? 'team-card--active' : ''}`}
            >
              <div className="team-card-media">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={420}
                  height={560}
                  className="team-card-img"
                />
              </div>

              <div className="team-card-body">
                <div className="team-card-header">
                  <h3 className="team-card-name">{member.name}</h3>
                  <span className="team-card-exp">{member.experience}</span>
                </div>

                <p className="team-card-specialty">{member.specialty}</p>

                {activeId === member.id && (
                  <div className="team-card-detail">
                    <div className="team-info-grid">
                      <div className="team-info-item">
                        <span className="team-info-label">Edad</span>
                        <span className="team-info-value">{member.age} años</span>
                      </div>
                      <div className="team-info-item">
                        <span className="team-info-label">Estatura</span>
                        <span className="team-info-value">{member.height}</span>
                      </div>
                      <div className="team-info-item">
                        <span className="team-info-label">Orientación</span>
                        <span className="team-info-value">{member.orientation}</span>
                      </div>
                      <div className="team-info-item">
                        <span className="team-info-label">Rol</span>
                        <span className="team-info-value">{member.sexualRole}</span>
                      </div>
                    </div>
                    <p className="team-card-bio">{member.bio}</p>
                  </div>
                )}

                <button
                  type="button"
                  className="team-toggle-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(activeId === member.id ? null : member.id);
                  }}
                >
                  {activeId === member.id ? '— Cerrar' : '+ Conocer más'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="team-footer-note">
          <p>Todos nuestros terapeutas trabajan en un entorno de <strong>total discreción y respeto</strong>. Cada sesión es individual y privada.</p>
        </div>
      </div>
    </section>
  );
};
