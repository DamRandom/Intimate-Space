'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Calendar, 
  Clock, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail, 
  Heart, 
  Coffee, 
  Compass, 
  FileText, 
  X,
  MessageCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BRAND_CONFIG } from '@/data/brand';
import { UserBooking } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function MiCuentaPage() {
  const router = useRouter();
  const { 
    user, 
    isLoading, 
    logout, 
    getUserBookings, 
    cancelBooking, 
    updatePreferences, 
    updateProfile 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'reservas' | 'preferencias' | 'perfil'>('reservas');
  
  // Preferences form state
  const [prefAroma, setPrefAroma] = useState('');
  const [prefPressure, setPrefPressure] = useState<'suave' | 'media' | 'firme' | 'profunda'>('firme');
  const [prefBeverage, setPrefBeverage] = useState('');
  const [prefNotes, setPrefNotes] = useState('');
  const [prefSavedMsg, setPrefSavedMsg] = useState(false);

  // Profile form state
  const [profName, setProfName] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profSavedMsg, setProfSavedMsg] = useState(false);

  // Voucher modal state
  const [selectedVoucher, setSelectedVoucher] = useState<UserBooking | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Sync user data to local forms
  useEffect(() => {
    if (user) {
      setProfName(user.name);
      setProfPhone(user.phone);
      if (user.preferences) {
        setPrefAroma(user.preferences.aroma || 'Eucalipto & Cedro Silvestre');
        setPrefPressure(user.preferences.pressure || 'firme');
        setPrefBeverage(user.preferences.beverage || 'Infusión de Menta Andina');
        setPrefNotes(user.preferences.notes || '');
      }
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <LoadingSpinner
        fullScreen
        size="lg"
        text="ESPACIO ÍNTIMO"
        subtext="Accediendo a tu espacio privado..."
        showLogo
      />
    );
  }

  const userBookings = getUserBookings();

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      aroma: prefAroma,
      pressure: prefPressure,
      beverage: prefBeverage,
      notes: prefNotes
    });
    setPrefSavedMsg(true);
    setTimeout(() => setPrefSavedMsg(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profName,
      phone: profPhone
    });
    setProfSavedMsg(true);
    setTimeout(() => setProfSavedMsg(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getStatusBadge = (status: UserBooking['status']) => {
    switch (status) {
      case 'confirmada':
        return <span className="zen-status-badge confirmed">Confirmada</span>;
      case 'pendiente':
        return <span className="zen-status-badge pending">En Coordinación</span>;
      case 'completada':
        return <span className="zen-status-badge completed">Completada</span>;
      case 'cancelada':
        return <span className="zen-status-badge cancelled">Cancelada</span>;
      default:
        return <span className="zen-status-badge">{status}</span>;
    }
  };

  return (
    <div className="zen-account-page-wrapper">
      <Navbar />

      <main className="zen-account-main">
        <div className="container zen-account-container">
          {/* Top Welcome Bar */}
          <header className="zen-account-top-header">
            <div>
              <span className="zen-badge-pill">
                <Sparkles size={13} className="text-champagne" />
                Socio Espacio Íntimo
              </span>
              <h1 className="zen-account-name">Bienvenido, {user.name}</h1>
              <p className="zen-account-subtext">
                Tu refugio personal de bienestar y discreción en Miraflores.
              </p>
            </div>
            <div className="zen-account-top-actions">
              <Link href="/catalogo" className="btn-zen-filled">
                <Plus size={16} />
                <span>Reservar Sesión</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-zen-outline zen-logout-btn"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </header>

          {/* Luxury Digital Membership Card */}
          <section className="zen-vip-card-section" aria-label="Tarjeta de Membresía Digital">
            <div className="zen-vip-card">
              <div className="zen-vip-card-glow" />
              <div className="zen-vip-card-header">
                <div className="zen-vip-card-brand">
                  <span className="brand-word">ESPACIO ÍNTIMO</span>
                  <span className="brand-sub">LUXURY CLUB</span>
                </div>
                <div className="zen-vip-chip">
                  <div className="chip-line" />
                  <div className="chip-line" />
                </div>
              </div>

              <div className="zen-vip-card-code">
                <span>{user.memberCode || 'EI-VIP-842'}</span>
              </div>

              <div className="zen-vip-card-footer">
                <div className="zen-vip-card-holder">
                  <span className="vip-meta-label">SOCIO TITULAR</span>
                  <span className="vip-meta-val">{user.name}</span>
                </div>
                <div className="zen-vip-card-tier">
                  <span className="vip-meta-label">CATEGORÍA</span>
                  <span className="vip-meta-tier">
                    {user.membershipTier === 'black_label' ? 'BLACK LABEL' : 'VIP RESIDENT'}
                  </span>
                </div>
                <div className="zen-vip-card-status">
                  <span className="vip-meta-label">UBICACIÓN</span>
                  <span className="vip-meta-val">Miraflores, Lima</span>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="zen-account-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'reservas'}
              onClick={() => setActiveTab('reservas')}
              className={`zen-acc-tab-btn ${activeTab === 'reservas' ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>Mis Sesiones & Citas ({userBookings.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'preferencias'}
              onClick={() => setActiveTab('preferencias')}
              className={`zen-acc-tab-btn ${activeTab === 'preferencias' ? 'active' : ''}`}
            >
              <Heart size={18} />
              <span>Preferencias Botánicas</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'perfil'}
              onClick={() => setActiveTab('perfil')}
              className={`zen-acc-tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Mi Perfil de Socio</span>
            </button>
          </div>

          {/* TAB 1: BOOKINGS */}
          {activeTab === 'reservas' && (
            <div className="zen-tab-panel">
              <div className="zen-panel-head">
                <div>
                  <h2 className="zen-panel-title">Historial de Experiencias y Próximas Citas</h2>
                  <p className="zen-panel-desc">
                    Revisa las fechas coordinadas, terapeuta asignado y comprobantes privados.
                  </p>
                </div>
                <Link href="/catalogo" className="btn-zen">
                  Explorar Catálogo
                </Link>
              </div>

              {userBookings.length === 0 ? (
                <div className="zen-empty-state">
                  <Calendar size={42} className="text-champagne" />
                  <h3>No tienes reservas activas por el momento</h3>
                  <p>
                    Elige una de nuestras experiencias terapéuticas o rituales energéticos y
                    reserva con tu tarifa preferencial de socio.
                  </p>
                  <Link href="/#reservas" className="btn-zen-filled">
                    Solicitar mi primera cita
                  </Link>
                </div>
              ) : (
                <div className="zen-booking-cards-grid">
                  {userBookings.map((b) => (
                    <article key={b.id} className="zen-booking-card">
                      <div className="zen-booking-card-top">
                        <div className="zen-booking-ref-block">
                          <span className="zen-booking-ref">{b.id}</span>
                          <span className="zen-booking-tag">{b.serviceTag || 'Sesión Privada'}</span>
                        </div>
                        {getStatusBadge(b.status)}
                      </div>

                      <h3 className="zen-booking-service-name">{b.serviceName}</h3>

                      <div className="zen-booking-meta-grid">
                        <div className="zen-booking-meta-item">
                          <Calendar size={15} />
                          <span>{b.date || 'Fecha por coordinar'}</span>
                        </div>
                        <div className="zen-booking-meta-item">
                          <Clock size={15} />
                          <span>{b.timeSlot} ({b.duration})</span>
                        </div>
                        {b.therapist && (
                          <div className="zen-booking-meta-item therapist">
                            <Sparkles size={15} className="text-champagne" />
                            <span>Terapeuta: <strong>{b.therapist}</strong></span>
                          </div>
                        )}
                        <div className="zen-booking-meta-item price">
                          <span className="text-champagne font-serif font-bold">{b.price}</span>
                        </div>
                      </div>

                      {b.notes && (
                        <p className="zen-booking-notes-preview">
                          <strong>Notas de cita:</strong> {b.notes}
                        </p>
                      )}

                      <div className="zen-booking-actions">
                        <button
                          type="button"
                          onClick={() => setSelectedVoucher(b)}
                          className="zen-booking-action-btn voucher"
                        >
                          <FileText size={15} />
                          <span>Ver Voucher</span>
                        </button>

                        <a
                          href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                            `Hola Conserjería Espacio Íntimo, consulto sobre mi reserva ${b.id} (${b.serviceName}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="zen-booking-action-btn wa"
                        >
                          <MessageCircle size={15} />
                          <span>WhatsApp Concierge</span>
                        </a>

                        {b.status === 'pendiente' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('¿Deseas cancelar esta solicitud de reserva?')) {
                                cancelBooking(b.id);
                              }
                            }}
                            className="zen-booking-action-btn cancel"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferencias' && (
            <div className="zen-tab-panel">
              <div className="zen-panel-head">
                <div>
                  <h2 className="zen-panel-title">Tus Preferencias Botánicas & Sensoriales</h2>
                  <p className="zen-panel-desc">
                    Personalizamos cada detalle de tu cabina privada antes de tu llegada.
                  </p>
                </div>
              </div>

              {prefSavedMsg && (
                <div className="zen-auth-alert success">
                  <CheckCircle size={18} />
                  <span>Preferencias guardadas. Serán aplicadas en tus próximas sesiones.</span>
                </div>
              )}

              <form onSubmit={handleSavePreferences} className="zen-preferences-form">
                <div className="zen-pref-grid">
                  {/* Aroma */}
                  <div className="zen-pref-box">
                    <label className="zen-pref-label">
                      <Compass size={18} className="text-champagne" />
                      <span>Aromaterapia de Cabina</span>
                    </label>
                    <p className="zen-pref-hint">Aceite esencial vaporizado durante el masaje.</p>
                    <select
                      value={prefAroma}
                      onChange={(e) => setPrefAroma(e.target.value)}
                      className="zen-pref-select"
                    >
                      <option value="Eucalipto & Cedro Silvestre">Eucalipto & Cedro Silvestre (Despeje & Vigor)</option>
                      <option value="Sándalo Oriental & Ámbar">Sándalo Oriental & Ámbar (Conexión Profunda)</option>
                      <option value="Lavanda Botánica & Manzanilla">Lavanda Botánica & Manzanilla (Sedación Total)</option>
                      <option value="Romero Andino & Bergamota">Romero Andino & Bergamota (Revitalizante)</option>
                    </select>
                  </div>

                  {/* Pressure */}
                  <div className="zen-pref-box">
                    <label className="zen-pref-label">
                      <Sparkles size={18} className="text-champagne" />
                      <span>Intensidad de Presión</span>
                    </label>
                    <p className="zen-pref-hint">Fuerza aplicada en la musculatura.</p>
                    <div className="zen-pressure-selector">
                      {(['suave', 'media', 'firme', 'profunda'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPrefPressure(p)}
                          className={`zen-pressure-btn ${prefPressure === p ? 'active' : ''}`}
                        >
                          {p.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Beverage */}
                  <div className="zen-pref-box">
                    <label className="zen-pref-label">
                      <Coffee size={18} className="text-champagne" />
                      <span>Bebida de Cortesía Post-Sesión</span>
                    </label>
                    <p className="zen-pref-hint">Servida al finalizar en la zona de reposo.</p>
                    <select
                      value={prefBeverage}
                      onChange={(e) => setPrefBeverage(e.target.value)}
                      className="zen-pref-select"
                    >
                      <option value="Infusión de Menta Andina">Infusión caliente de Menta Andina</option>
                      <option value="Agua de Manantial con Cítricos">Agua de Manantial con Cítricos & Gas</option>
                      <option value="Té Verde Sencha Orgánico">Té Verde Sencha Orgánico</option>
                      <option value="Café Espresso Italiano">Café Espresso Italiano</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="zen-pref-box full-width">
                    <label className="zen-pref-label">
                      <FileText size={18} className="text-champagne" />
                      <span>Instrucciones Especiales / Zonas de Dolor</span>
                    </label>
                    <p className="zen-pref-hint">
                      Indica si sufres alguna molestia (lumbar, cervical, etc.) o detalles de confort.
                    </p>
                    <textarea
                      rows={3}
                      value={prefNotes}
                      onChange={(e) => setPrefNotes(e.target.value)}
                      placeholder="Ej: Mayor énfasis en zona dorsal y cuello. No aplicar presión en tobillo derecho."
                      className="zen-pref-textarea"
                    />
                  </div>
                </div>

                <div className="zen-pref-footer">
                  <button type="submit" className="btn-zen-filled">
                    Guardar Preferencias de Confort
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'perfil' && (
            <div className="zen-tab-panel">
              <div className="zen-panel-head">
                <div>
                  <h2 className="zen-panel-title">Tus Datos de Socio</h2>
                  <p className="zen-panel-desc">
                    Mantén actualizada tu información de contacto para confirmar citas vía WhatsApp.
                  </p>
                </div>
              </div>

              {profSavedMsg && (
                <div className="zen-auth-alert success">
                  <CheckCircle size={18} />
                  <span>Perfil actualizado correctamente.</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="zen-profile-form">
                <div className="zen-input-group">
                  <label className="zen-input-label">Nombre Completo o Alias</label>
                  <div className="zen-input-wrapper">
                    <User size={18} className="zen-input-icon" />
                    <input
                      type="text"
                      required
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="zen-auth-input"
                    />
                  </div>
                </div>

                <div className="zen-input-group">
                  <label className="zen-input-label">WhatsApp de Contacto</label>
                  <div className="zen-input-wrapper">
                    <Phone size={18} className="zen-input-icon" />
                    <input
                      type="tel"
                      required
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="zen-auth-input"
                    />
                  </div>
                </div>

                <div className="zen-input-group">
                  <label className="zen-input-label">Correo Electrónico (Identificador)</label>
                  <div className="zen-input-wrapper disabled">
                    <Mail size={18} className="zen-input-icon" />
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="zen-auth-input disabled"
                    />
                  </div>
                  <span className="zen-input-hint">El correo está vinculado a tu cuenta única.</span>
                </div>

                <div className="zen-pref-footer">
                  <button type="submit" className="btn-zen-filled">
                    Actualizar Datos
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* VOUCHER MODAL */}
      {selectedVoucher && (
        <div className="zen-voucher-overlay" onClick={() => setSelectedVoucher(null)}>
          <div className="zen-voucher-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedVoucher(null)}
              className="zen-voucher-close"
              aria-label="Cerrar voucher"
            >
              <X size={20} />
            </button>

            <div className="zen-voucher-header">
              <span className="zen-voucher-brand">ESPACIO ÍNTIMO • MIRAFLORES</span>
              <h2>Comprobante de Reserva Privada</h2>
              <span className="zen-voucher-id">CÓDIGO: {selectedVoucher.id}</span>
            </div>

            <div className="zen-voucher-body">
              <div className="zen-voucher-row">
                <span className="v-label">Experiencia:</span>
                <span className="v-val font-serif">{selectedVoucher.serviceName}</span>
              </div>
              <div className="zen-voucher-row">
                <span className="v-label">Socio:</span>
                <span className="v-val">{selectedVoucher.userName} ({user.memberCode})</span>
              </div>
              <div className="zen-voucher-row">
                <span className="v-label">Fecha Programada:</span>
                <span className="v-val">{selectedVoucher.date || 'A coordinar'}</span>
              </div>
              <div className="zen-voucher-row">
                <span className="v-label">Horario:</span>
                <span className="v-val">{selectedVoucher.timeSlot}</span>
              </div>
              <div className="zen-voucher-row">
                <span className="v-label">Duración:</span>
                <span className="v-val">{selectedVoucher.duration}</span>
              </div>
              <div className="zen-voucher-row">
                <span className="v-label">Terapeuta Asignado:</span>
                <span className="v-val">{selectedVoucher.therapist || 'Por confirmar por conserjería'}</span>
              </div>
              <div className="zen-voucher-row highlight">
                <span className="v-label">Tarifa Preferencial:</span>
                <span className="v-val text-champagne">{selectedVoucher.price}</span>
              </div>
            </div>

            <div className="zen-voucher-protocol">
              <h4>Protocolo de Asistencia & Confort</h4>
              <ul>
                <li>Cabina privada sanitizada con aromaterapia botánica.</li>
                <li>Ducha privada disponible antes y después de la sesión.</li>
                <li>Se solicita llegar con 10 minutos de anticipación en Miraflores.</li>
                <li>Máxima confidencialidad garantizada.</li>
              </ul>
            </div>

            <div className="zen-voucher-footer">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-zen"
              >
                Imprimir o Guardar PDF
              </button>
              <button
                type="button"
                onClick={() => setSelectedVoucher(null)}
                className="btn-zen-filled"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
