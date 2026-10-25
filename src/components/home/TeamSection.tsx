import React from 'react';
import Image from 'next/image';

export interface TeamMember {
  id: string;
  name: string;
  experience: string;
  image: string;
}

export const TEAM_DATA: TeamMember[] = [
  {
    id: 'alver',
    name: 'Alver',
    experience: '8 años de experiencia',
    image: '/terapeutas/alver.jpeg',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    experience: '6 años de experiencia',
    image: '/terapeutas/carlos.jpeg',
  },
  {
    id: 'glanko',
    name: 'Glanko',
    experience: '5 años de experiencia',
    image: '/terapeutas/glanko.jpeg',
  },
  {
    id: 'raul',
    name: 'Raul',
    experience: '4 años de experiencia',
    image: '/terapeutas/raul.jpeg',
  },
];

export const TeamSection: React.FC = () => {
  return (
    <section id="equipo" className="section-zen team-section">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Nuestro Equipo</span>
          <h2 className="section-heading">Terapeutas</h2>
          <p className="section-subtext">
            Profesionales dedicados al arte del bienestar y la desconexión total en Miraflores.
          </p>
        </div>

        {/* Grid de Terapeutas Minimalista y Elegante */}
        <div className="team-grid">
          {TEAM_DATA.map((member) => (
            <article key={member.id} className="team-card-minimal">
              <div className="team-card-media-minimal">
                <Image
                  src={member.image}
                  alt={`Terapeuta ${member.name}`}
                  width={460}
                  height={600}
                  className="team-card-img-minimal"
                  loading="lazy"
                />
                <div className="team-card-fade-minimal" />
                <div className="team-card-caption-minimal">
                  <h3 className="team-card-name-minimal">{member.name}</h3>
                  <p className="team-card-exp-minimal">{member.experience}</p>
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
    </section>
  );
};

