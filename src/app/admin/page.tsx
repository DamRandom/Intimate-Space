'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Crown,
  BarChart3,
  Calendar,
  Users,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatsPanel } from '@/components/admin/StatsPanel';
import { BookingsPanel } from '@/components/admin/BookingsPanel';
import { MasajistasPanel } from '@/components/admin/MasajistasPanel';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout, bookings, updateBookingStatus } = useAuth();

  // Pestaña inicial por defecto: Estadísticas
  const [activeTab, setActiveTab] = useState<'estadisticas' | 'citas' | 'masajistas'>('estadisticas');

  // Redirigir si no es admin
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?role=admin');
      } else if (user.role !== 'admin') {
        router.push('/mi-cuenta');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <LoadingSpinner
        fullScreen
        size="lg"
        text="CONSERJERÍA PRIVADA"
        subtext="Verificando credenciales de acceso..."
        showLogo
      />
    );
  }

  const handleLogout = async () => {
    await logout(); // logout() redirige a /login internamente
  };


  return (
    <div className="admin-page-wrapper">
      <Navbar />

      <main className="admin-main-container">
        {/* Header Superior — Quiet Luxury & Zen */}
        <header className="admin-header">
          <div>
            <div className="admin-badge">
              <Crown size={12} />
              <span>Conserjería de Lujo & Control Central</span>
            </div>
            <h1 className="admin-title">
              Espacio Íntimo Miraflores
            </h1>
            <p className="admin-subtitle">
              Supervisión confidencial de experiencias, terapeutas y gestión centralizada.
            </p>
          </div>

          <div className="admin-header-actions">
            <Link href="/catalogo" className="admin-pill-btn">
              <ExternalLink size={13} style={{ color: 'var(--champagne)' }} />
              <span>Ver Catálogo</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-pill-btn-danger"
              title="Cerrar sesión"
            >
              <LogOut size={13} />
              <span>Salir</span>
            </button>
          </div>
        </header>

        {/* Navegación por Pestañas Minimalista (Línea activa dorada) */}
        <nav className="admin-tabs-nav" aria-label="Secciones del panel">
          <button
            type="button"
            onClick={() => setActiveTab('estadisticas')}
            className={`admin-tab-btn ${activeTab === 'estadisticas' ? 'active' : ''}`}
          >
            <BarChart3 size={15} />
            <span>Estadísticas</span>
            {activeTab === 'estadisticas' && <span className="tab-active-indicator" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('citas')}
            className={`admin-tab-btn ${activeTab === 'citas' ? 'active' : ''}`}
          >
            <Calendar size={15} />
            <span>Gestión de Citas</span>
            {activeTab === 'citas' && <span className="tab-active-indicator" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('masajistas')}
            className={`admin-tab-btn ${activeTab === 'masajistas' ? 'active' : ''}`}
          >
            <Users size={15} />
            <span>Terapeutas</span>
            {activeTab === 'masajistas' && <span className="tab-active-indicator" />}
          </button>
        </nav>

        {/* Contenido de la pestaña activa */}
        <div>
          {activeTab === 'estadisticas' && <StatsPanel />}

          {activeTab === 'citas' && (
            <BookingsPanel
              fallbackBookings={bookings}
              onFallbackStatusUpdate={updateBookingStatus}
            />
          )}

          {activeTab === 'masajistas' && <MasajistasPanel />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
