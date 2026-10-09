import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="zen-hero">
      <div className="container">
        <div className="zen-hero-inner">

          <h1 className="zen-hero-title">
            Pausa.<br />Respira.<br />Recupérate.
          </h1>

          <p className="zen-hero-sub">
            Masajes terapéuticos para hombres.<br />
            Privacidad absoluta en Miraflores, Lima.
          </p>

          <div className="zen-hero-actions">
            <a href="#reservas" className="btn-zen-filled">
              Reservar sesión
            </a>
            <a href="/catalogo" className="btn-zen">
              Ver servicios
            </a>
          </div>

          <span className="zen-hero-tag">Men for Men · Miraflores</span>
        </div>
      </div>
    </section>
  );
};
