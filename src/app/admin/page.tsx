'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Crown, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock3, 
  XCircle, 
  MessageCircle, 
  ExternalLink, 
  LogOut, 
  Sparkles, 
  DollarSign, 
  UserCheck, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BookingStatus, UserBooking } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const THERAPISTS_LIST = [
  'Alejandro R. (Ritual INTI & Terapéutico)',
  'Carlos M. (Aromaterapia & Relajación)',
  'Mateo S. (Descontracturante & Deportivo)',
  'Rodrigo D. (Dúo Ceremonial)'
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout, bookings, updateBookingStatus } = useAuth();

  const [activeTab, setActiveTab] = useState<'reservas' | 'clientes' | 'cabinas'>('reservas');
  const [statusFilter, setStatusFilter] = useState<'todas' | BookingStatus>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Redirect if not admin
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
      <div className="zen-loading-screen">
        <Crown className="animate-pulse text-champagne" size={36} />
        <p>Verificando credenciales de Conserjería...</p>
      </div>
    );
  }

  // Handle status update with feedback
  const handleStatusChange = (bookingId: string, newStatus: BookingStatus, therapist?: string) => {
    updateBookingStatus(bookingId, newStatus, therapist);
    setActionNotice(`Reserva ${bookingId} actualizada a: ${newStatus.toUpperCase()}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = statusFilter === 'todas' ? true : b.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      query === '' ||
      b.id.toLowerCase().includes(query) ||
      b.userName.toLowerCase().includes(query) ||
      b.serviceName.toLowerCase().includes(query) ||
      (b.userPhone && b.userPhone.includes(query));

    return matchesFilter && matchesSearch;
  });

  // Calculate metrics
  const totalBookingsCount = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmada').length;
  const pendingCount = bookings.filter((b) => b.status === 'pendiente').length;
  const completedCount = bookings.filter((b) => b.status === 'completada').length;

  const estimatedRevenue = bookings
    .filter((b) => b.status === 'confirmada' || b.status === 'completada')
    .reduce((acc, curr) => {
      const num = parseInt(curr.price.replace(/\D/g, ''), 10) || 0;
      return acc + num;
    }, 0);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="zen-admin-page-wrapper">
      <Navbar />

      <main className="zen-admin-main">
        <div className="container zen-admin-container">
          {/* Top Admin Header */}
          <header className="zen-admin-top-header">
            <div>
              <div className="zen-admin-badge">
                <Crown size={14} />
                <span>Conserjería de Lujo & Control Central</span>
              </div>
              <h1 className="zen-admin-title">Panel Administrativo de Citas</h1>
              <p className="zen-admin-subtitle">
                Supervisión confidencial de experiencias, terapeutas y socios en Miraflores.
              </p>
            </div>

            <div className="zen-admin-header-actions">
              <Link href="/catalogo" className="btn-zen-outline">
                <ExternalLink size={15} />
                <span>Ver Catálogo Web</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-zen-outline zen-logout-btn"
                title="Cerrar sesión de administrador"
              >
                <LogOut size={15} />
                <span>Salir</span>
              </button>
            </div>
          </header>

          {/* Feedback banner */}
          {actionNotice && (
            <div className="zen-auth-alert success mb-6">
              <CheckCircle2 size={18} />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* KPIs Overview Cards */}
          <section className="zen-admin-kpi-grid" aria-label="Métricas Principales">
            <div className="zen-kpi-card">
              <div className="zen-kpi-header">
                <span className="zen-kpi-title">Total de Solicitudes</span>
                <Calendar size={18} className="text-champagne" />
              </div>
              <div className="zen-kpi-value">{totalBookingsCount}</div>
              <p className="zen-kpi-sub">Historial consolidado</p>
            </div>

            <div className="zen-kpi-card">
              <div className="zen-kpi-header">
                <span className="zen-kpi-title">Citas Confirmadas</span>
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <div className="zen-kpi-value text-emerald-400">{confirmedCount}</div>
              <p className="zen-kpi-sub">Con terapeuta asignado</p>
            </div>

            <div className="zen-kpi-card highlight">
              <div className="zen-kpi-header">
                <span className="zen-kpi-title">Pendientes de Coordinar</span>
                <Clock3 size={18} className="text-amber-400" />
              </div>
              <div className="zen-kpi-value text-amber-400">{pendingCount}</div>
              <p className="zen-kpi-sub">Requieren confirmación vía WhatsApp</p>
            </div>

            <div className="zen-kpi-card">
              <div className="zen-kpi-header">
                <span className="zen-kpi-title">Ingresos Confirmados</span>
                <DollarSign size={18} className="text-champagne" />
              </div>
              <div className="zen-kpi-value text-champagne">S/ {estimatedRevenue}</div>
              <p className="zen-kpi-sub">{completedCount} sesiones finalizadas</p>
            </div>
          </section>

          {/* Navigation Sub-Tabs */}
          <div className="zen-admin-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('reservas')}
              className={`zen-admin-tab-btn ${activeTab === 'reservas' ? 'active' : ''}`}
            >
              <Calendar size={16} />
              <span>Gestión de Citas ({bookings.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cabinas')}
              className={`zen-admin-tab-btn ${activeTab === 'cabinas' ? 'active' : ''}`}
            >
              <Sparkles size={16} />
              <span>Cabinas & Terapeutas en Turno</span>
            </button>
          </div>

          {/* TAB 1: BOOKINGS LIST */}
          {activeTab === 'reservas' && (
            <div className="zen-admin-tab-content">
              {/* Filter and Search Bar */}
              <div className="zen-admin-toolbar">
                <div className="zen-search-box">
                  <Search size={16} className="zen-search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, ID de cita, servicio o teléfono..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="zen-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="zen-clear-search-btn"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="zen-status-filters">
                  <Filter size={15} className="text-champagne" />
                  {(['todas', 'pendiente', 'confirmada', 'completada', 'cancelada'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`zen-filter-chip ${statusFilter === st ? 'active' : ''}`}
                      >
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Bookings Table / Cards */}
              {filteredBookings.length === 0 ? (
                <div className="zen-empty-state">
                  <AlertCircle size={38} className="text-champagne" />
                  <h3>No se encontraron reservas con los filtros seleccionados</h3>
                  <p>Prueba limpiando los términos de búsqueda o cambiando el filtro de estado.</p>
                </div>
              ) : (
                <div className="zen-admin-bookings-list">
                  {filteredBookings.map((b) => {
                    const cleanPhone = b.userPhone.replace(/\D/g, '');
                    const waMessage = encodeURIComponent(
                      `Hola ${b.userName}, te saludamos cordialmente de la Conserjería de Espacio Íntimo Miraflores sobre tu reserva ${b.id} para el servicio *${b.serviceName}* (${b.duration}) programada para el *${b.date || 'a coordinar'}* en horario *${b.timeSlot}*. ¿Deseas confirmar la sesión privada?`
                    );

                    return (
                      <div key={b.id} className={`zen-admin-booking-row status-${b.status}`}>
                        {/* Column 1: Info & Client */}
                        <div className="row-col main">
                          <div className="booking-head-tags">
                            <span className="booking-ref-id">{b.id}</span>
                            <span className="booking-date-stamp">
                              {new Date(b.createdAt).toLocaleDateString('es-PE', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <h3 className="booking-client-name">{b.userName}</h3>
                          <div className="booking-contact-pills">
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${waMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="contact-pill wa"
                            >
                              <MessageCircle size={14} />
                              <span>{b.userPhone}</span>
                            </a>
                            {b.userEmail && (
                              <span className="contact-pill email">{b.userEmail}</span>
                            )}
                          </div>

                          {b.notes && (
                            <div className="booking-client-notes">
                              <strong>Petición especial:</strong> {b.notes}
                            </div>
                          )}
                        </div>

                        {/* Column 2: Service Details */}
                        <div className="row-col service-info">
                          <span className="row-col-label">EXPERIENCIA</span>
                          <span className="service-title">{b.serviceName}</span>
                          <div className="service-meta">
                            <span><Calendar size={13} /> {b.date || 'Por fijar'}</span>
                            <span><Clock size={13} /> {b.timeSlot}</span>
                            <span className="service-price font-serif">{b.price} ({b.duration})</span>
                          </div>
                        </div>

                        {/* Column 3: Therapist Assignment */}
                        <div className="row-col therapist-info">
                          <span className="row-col-label">TERAPEUTA ASIGNADO</span>
                          <select
                            value={b.therapist || ''}
                            onChange={(e) => {
                              const therapistSelected = e.target.value;
                              handleStatusChange(b.id, b.status, therapistSelected);
                            }}
                            className="zen-admin-select"
                          >
                            <option value="">-- Sin asignar --</option>
                            {THERAPISTS_LIST.map((t) => (
                              <option key={t} value={t.split(' ')[0] + ' ' + t.split(' ')[1]}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Column 4: Status Management */}
                        <div className="row-col status-actions">
                          <span className="row-col-label">ESTADO DE RESERVA</span>
                          <div className="status-selector-row">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus, b.therapist)}
                              className={`zen-status-select-badge ${b.status}`}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="confirmada">Confirmada</option>
                              <option value="completada">Completada</option>
                              <option value="cancelada">Cancelada</option>
                            </select>
                          </div>

                          <div className="quick-actions-row">
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${waMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-zen-wa-action"
                              title="Contactar al cliente por WhatsApp"
                            >
                              <MessageCircle size={15} />
                              <span>WhatsApp</span>
                            </a>
                            {b.status === 'pendiente' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(b.id, 'confirmada', b.therapist || 'Alejandro R.')}
                                className="btn-zen-quick-confirm"
                                title="Confirmar de inmediato"
                              >
                                <CheckCircle2 size={15} />
                                <span>Confirmar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ROOMS & THERAPISTS */}
          {activeTab === 'cabinas' && (
            <div className="zen-admin-tab-content">
              <div className="zen-rooms-grid">
                <div className="zen-room-card active">
                  <div className="room-header">
                    <h3>Cabina Zen Suite 01 (Madera & Loto)</h3>
                    <span className="room-status-badge available">Disponible</span>
                  </div>
                  <p className="room-desc">
                    Acondicionada con iluminación cálida indirecta, mesa hidráulica y difusor de
                    Eucalipto & Cedro.
                  </p>
                  <div className="room-meta">
                    <span><strong>Terapeuta de Turno:</strong> Alejandro R.</span>
                    <span><strong>Próxima Sesión:</strong> 15:00 hrs</span>
                  </div>
                </div>

                <div className="zen-room-card active">
                  <div className="room-header">
                    <h3>Cabina INTI Suite 02 (Ceremonial Sensorial)</h3>
                    <span className="room-status-badge booked">En Sesión Privada</span>
                  </div>
                  <p className="room-desc">
                    Cabina doble con sistema de sonido 432Hz y ducha privada integrada en suite.
                  </p>
                  <div className="room-meta">
                    <span><strong>Terapeuta de Turno:</strong> Carlos M.</span>
                    <span><strong>Servicio:</strong> Ritual INTI Sensorial</span>
                  </div>
                </div>

                <div className="zen-room-card">
                  <div className="room-header">
                    <h3>Cabina Dúo Suite 03 (Wellness Lounge)</h3>
                    <span className="room-status-badge available">Disponible</span>
                  </div>
                  <p className="room-desc">
                    Espacio amplio con dos camillas para sesión simultánea o amigos.
                  </p>
                  <div className="room-meta">
                    <span><strong>Terapeuta de Turno:</strong> Mateo S. / Rodrigo D.</span>
                    <span><strong>Disponibilidad:</strong> Tarde & Noche</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
