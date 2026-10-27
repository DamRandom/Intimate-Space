'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { UserBooking, BookingStatus, Masajista } from '@/types';
import { StatusBadge } from './StatusBadge';
import {
  isBookingLocked,
  getAdminAllowedNextStatuses,
  STATUS_CONFIG,
} from '@/lib/booking-utils';
import {
  Search,
  MessageCircle,
  Calendar,
  Clock,
  User,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

interface BookingsPanelProps {
  fallbackBookings?: UserBooking[];
  onFallbackStatusUpdate?: (id: string, status: BookingStatus, therapist?: string) => void;
}

export function BookingsPanel({
  fallbackBookings = [],
  onFallbackStatusUpdate,
}: BookingsPanelProps) {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [masajistas, setMasajistas] = useState<Masajista[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'todas' | BookingStatus>('todas');
  const [masajistaFilter, setMasajistaFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resBookings = await fetch('/api/admin/bookings?per_page=100');
      if (resBookings.ok) {
        const data = await resBookings.json();
        if (data.bookings && data.bookings.length > 0) {
          setBookings(data.bookings);
        } else if (fallbackBookings.length > 0) {
          setBookings(fallbackBookings);
        }
      } else {
        if (fallbackBookings.length > 0) setBookings(fallbackBookings);
      }

      const resMasajistas = await fetch('/api/admin/masajistas');
      if (resMasajistas.ok) {
        const data = await resMasajistas.json();
        setMasajistas(data.masajistas || []);
      }
    } catch (err) {
      console.warn('Error fetching API, usando fallback:', err);
      if (fallbackBookings.length > 0) setBookings(fallbackBookings);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBooking = async (
    bookingId: string,
    newStatus?: BookingStatus,
    masajistaId?: string,
    masajistaNombre?: string
  ) => {
    try {
      const payload: Record<string, any> = {};
      if (newStatus) payload.status = newStatus;
      if (masajistaId !== undefined) payload.masajistaId = masajistaId;
      if (masajistaNombre !== undefined) payload.masajistaNombre = masajistaNombre;

      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al actualizar reserva');
      }

      const resData = await res.json();
      const updated = resData.data;

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, ...updated } : b))
      );

      if (onFallbackStatusUpdate && newStatus) {
        onFallbackStatusUpdate(bookingId, newStatus, masajistaNombre);
      }

      setNotice(`Reserva ${bookingId} actualizada.`);
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      alert(err.message || 'No se pudo actualizar la reserva');
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus =
        statusFilter === 'todas' ? true : b.status === statusFilter;
      const matchesMasajista =
        masajistaFilter === 'todos'
          ? true
          : b.masajistaId === masajistaFilter || b.therapist === masajistaFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        b.id.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        (b.userPhone && b.userPhone.includes(q)) ||
        (b.therapist && b.therapist.toLowerCase().includes(q));

      return matchesStatus && matchesMasajista && matchesSearch;
    });
  }, [bookings, statusFilter, masajistaFilter, searchQuery]);

  const generateWhatsAppUrl = (b: UserBooking) => {
    const cleanPhone = (b.userPhone || '').replace(/\D/g, '');
    const phone = cleanPhone.startsWith('51') ? cleanPhone : `51${cleanPhone}`;
    const therapistName = b.therapist || 'su terapeuta asignado';
    
    let text = `Estimado ${b.userName}, le saludamos de Espacio Íntimo Miraflores. `;
    if (b.status === 'pendiente') {
      text += `Hemos recibido su solicitud de cita para el ritual "${b.serviceName}" (${b.duration}) para ${b.date || 'su fecha solicitada'} en el turno ${b.timeSlot}. Le confirmaremos la asignación de su terapeuta en breve.`;
    } else if (b.status === 'confirmada') {
      text += `Su cita para "${b.serviceName}" ha sido confirmada con ${therapistName} para ${b.date || ''} (${b.timeSlot}). Le esperamos con total privacidad.`;
    } else if (b.status === 'pagada') {
      text += `Confirmamos la recepción del pago de su cita para "${b.serviceName}". Todo se encuentra listo para su experiencia.`;
    } else if (b.status === 'por_pagar') {
      text += `Esperamos que haya disfrutado su sesión de "${b.serviceName}". Le enviamos los detalles para completar el pago pendiente (${b.price}).`;
    } else {
      text += `Nos comunicamos respecto a su reserva ${b.id} (${b.serviceName}). ¿En qué podemos asistirle?`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Editorial y Contador */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light, rgba(255,255,255,0.06))' }}>
        <div>
          <span className="section-label" style={{ marginBottom: '0.35rem' }}>
            Agenda & Operaciones
          </span>
          <h2 style={{ fontFamily: "var(--font-serif, 'Cinzel', serif)", fontSize: '1.8rem', fontWeight: 400, color: 'var(--text-primary)' }}>
            Gestión de Citas
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {filteredBookings.length} de {bookings.length} citas
          </span>
          <button
            onClick={fetchData}
            className="admin-pill-btn"
            title="Recargar citas"
          >
            <RefreshCw size={12} style={{ color: 'var(--champagne)' }} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '12px', background: 'rgba(88, 129, 87, 0.12)', border: '1px solid rgba(88, 129, 87, 0.3)', fontSize: '0.8rem', color: '#a3b18a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✓</span> {notice}
        </div>
      )}

      {/* Barra de Filtros Minimalista */}
      <div className="filter-toolbar">
        {/* Input de Búsqueda */}
        <div className="filter-search-wrap">
          <Search className="filter-search-icon" size={14} />
          <input
            type="text"
            placeholder="Buscar por cliente, ID, ritual o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-search-input"
          />
        </div>

        {/* Filtro por Estado */}
        <div className="filter-select-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="todas" style={{ background: '#121814', color: '#f2efe9' }}>Todos los estados</option>
            <option value="pendiente" style={{ background: '#121814', color: '#f2efe9' }}>Pendiente</option>
            <option value="confirmada" style={{ background: '#121814', color: '#f2efe9' }}>Confirmada</option>
            <option value="pagada" style={{ background: '#121814', color: '#f2efe9' }}>Pagada</option>
            <option value="ocurriendo" style={{ background: '#121814', color: '#f2efe9' }}>En Curso</option>
            <option value="por_pagar" style={{ background: '#121814', color: '#f2efe9' }}>Por Pagar</option>
            <option value="completada" style={{ background: '#121814', color: '#f2efe9' }}>Completada</option>
            <option value="cancelada" style={{ background: '#121814', color: '#f2efe9' }}>Cancelada</option>
          </select>
          <ChevronDown className="filter-select-chevron" size={13} />
        </div>

        {/* Filtro por Masajista */}
        {masajistas.length > 0 && (
          <div className="filter-select-wrap">
            <select
              value={masajistaFilter}
              onChange={(e) => setMasajistaFilter(e.target.value)}
              className="filter-select"
            >
              <option value="todos" style={{ background: '#121814', color: '#f2efe9' }}>Todos los terapeutas</option>
              {masajistas.map((m) => (
                <option key={m.id} value={m.id} style={{ background: '#121814', color: '#f2efe9' }}>
                  {m.nombre} ({m.estado})
                </option>
              ))}
            </select>
            <ChevronDown className="filter-select-chevron" size={13} />
          </div>
        )}
      </div>

      {/* Lista de Reservas Estilo Editorial Tabular */}
      {loading ? (
        <div style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid var(--champagne)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Cargando agenda de citas...
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          <Calendar size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem', opacity: 0.6 }} />
          <p style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            No hay citas que coincidan con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className="booking-list-wrap">
          {filteredBookings.map((b) => {
            const locked = isBookingLocked(b.status);
            const allowedTransitions = getAdminAllowedNextStatuses(b.status);

            return (
              <div key={b.id} className="booking-item-row">
                {/* Info principal: ID, Cliente, Servicio, Fecha */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                  <div className="booking-meta-line">
                    <span className="booking-id-tag">{b.id}</span>
                    <StatusBadge status={b.status} size="xs" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} style={{ color: 'var(--champagne)' }} />
                      {b.date || 'Fecha por definir'} • {b.timeSlot}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h4 className="booking-service-name">
                      {b.serviceName}
                    </h4>
                    <span className="booking-price-tag">
                      {b.price} <span style={{ color: 'var(--text-muted)' }}>({b.duration})</span>
                    </span>
                  </div>

                  <div className="booking-client-line">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={13} style={{ color: 'var(--champagne)' }} />
                      <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{b.userName}</strong>
                      {b.userPhone && (
                        <span style={{ color: 'var(--text-muted)' }}>({b.userPhone})</span>
                      )}
                    </span>

                    {b.notes && (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.74rem' }}>
                        &quot;{b.notes}&quot;
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones refinadas: Masajista, Transición de Estado, WhatsApp */}
                <div className="booking-actions-group">
                  {/* Asignación de Terapeuta */}
                  <div className="filter-select-wrap">
                    <select
                      disabled={locked}
                      value={b.masajistaId || ''}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedM = masajistas.find((m) => m.id === selectedId);
                        handleUpdateBooking(
                          b.id,
                          undefined,
                          selectedId || undefined,
                          selectedM?.nombre || undefined
                        );
                      }}
                      className="filter-select"
                      style={{ padding: '0.45rem 1.8rem 0.45rem 0.85rem', fontSize: '0.72rem' }}
                    >
                      <option value="" style={{ background: '#121814', color: '#727e70' }}>
                        (Asignar Terapeuta)
                      </option>
                      {masajistas.map((m) => (
                        <option key={m.id} value={m.id} style={{ background: '#121814', color: '#f2efe9' }}>
                          {m.nombre} {m.estado === 'ocupado' ? '• (Ocupado)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="filter-select-chevron" size={12} />
                  </div>

                  {/* Botones de Cambio de Estado */}
                  {!locked && allowedTransitions.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {allowedTransitions.map((nextStatus) => {
                        const config = STATUS_CONFIG[nextStatus];
                        return (
                          <button
                            key={nextStatus}
                            onClick={() => handleUpdateBooking(b.id, nextStatus)}
                            className="booking-action-btn"
                          >
                            Pasar a {config?.label || nextStatus}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Botón WhatsApp */}
                  <a
                    href={generateWhatsAppUrl(b)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="booking-wa-btn"
                    title="Contactar al cliente por WhatsApp"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
