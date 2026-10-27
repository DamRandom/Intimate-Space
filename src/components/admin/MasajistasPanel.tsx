'use client';

import React, { useState, useEffect } from 'react';
import { Masajista, MasakistaEstado } from '@/types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export function MasajistasPanel() {
  const [masajistas, setMasajistas] = useState<Masajista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMasajista, setEditingMasajista] = useState<Masajista | null>(null);

  // Form State
  const [formNombre, setFormNombre] = useState('');
  const [formNombreDisplay, setFormNombreDisplay] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formEspecialidades, setFormEspecialidades] = useState('');
  const [formEstado, setFormEstado] = useState<MasakistaEstado>('ocupado');
  const [formFotoUrl, setFormFotoUrl] = useState('');
  const [formNotas, setFormNotas] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMasajistas();
  }, []);

  const fetchMasajistas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/masajistas');
      if (!res.ok) throw new Error('Error al cargar masajistas');
      const data = await res.json();
      setMasajistas(data.masajistas || []);
    } catch (err: any) {
      setError(err.message || 'Error cargando masajistas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingMasajista(null);
    setFormNombre('');
    setFormNombreDisplay('');
    setFormWhatsapp('');
    setFormEspecialidades('');
    setFormEstado('ocupado');
    setFormFotoUrl('');
    setFormNotas('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Masajista) => {
    setEditingMasajista(m);
    setFormNombre(m.nombre);
    setFormNombreDisplay(m.nombreDisplay || '');
    setFormWhatsapp(m.whatsapp || '');
    setFormEspecialidades((m.especialidades || []).join(', '));
    setFormEstado(m.estado);
    setFormFotoUrl(m.fotoUrl || '');
    setFormNotas(m.notas || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) return;

    setSaving(true);
    try {
      const payload = {
        nombre: formNombre.trim(),
        nombreDisplay: formNombreDisplay.trim() || undefined,
        whatsapp: formWhatsapp.trim() || undefined,
        especialidades: formEspecialidades
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        estado: formEstado,
        fotoUrl: formFotoUrl.trim() || undefined,
        notas: formNotas.trim() || undefined,
      };

      const url = editingMasajista
        ? `/api/admin/masajistas/${editingMasajista.id}`
        : '/api/admin/masajistas';
      const method = editingMasajista ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al guardar masajista');
      }

      setIsModalOpen(false);
      await fetchMasajistas();
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEstado = async (m: Masajista) => {
    const nextEstado: MasakistaEstado =
      m.estado === 'disponible' ? 'ocupado' : 'disponible';

    try {
      const res = await fetch(`/api/admin/masajistas/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nextEstado }),
      });

      if (!res.ok) throw new Error('Error al actualizar estado');
      setMasajistas((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, estado: nextEstado } : item))
      );
    } catch (err: any) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  const handleDelete = async (m: Masajista) => {
    if (!confirm(`¿Estás seguro de eliminar a ${m.nombre}? Si tiene citas históricas, pasará a deshabilitado.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/masajistas/${m.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al procesar la solicitud');
      await fetchMasajistas();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header y Acción Principal */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light, rgba(255,255,255,0.06))' }}>
        <div>
          <span className="section-label" style={{ marginBottom: '0.35rem' }}>
            Plantel de Terapeutas
          </span>
          <h2 style={{ fontFamily: "var(--font-serif, 'Cinzel', serif)", fontSize: '1.8rem', fontWeight: 400, color: 'var(--text-primary)' }}>
            Equipo & Turnos
          </h2>
        </div>

        <button
          onClick={handleOpenCreate}
          className="admin-pill-btn-gold"
        >
          <Plus size={14} style={{ strokeWidth: 2.5 }} />
          <span>Registrar Terapeuta</span>
        </button>
      </div>

      {/* Indicador Zen de Disponibilidad Diaria */}
      <div style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--champagne)', display: 'inline-block' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 300, margin: 0 }}>
            <span style={{ color: 'var(--champagne)', fontWeight: 500 }}>Ciclo de disponibilidad:</span> El sistema resetea a todos los terapeutas a <span style={{ color: '#e9c49a' }}>Ocupado</span> a medianoche (hora de Lima).
          </p>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>00:00 UTC-5</span>
      </div>

      {/* Grid de Terapeutas */}
      {loading ? (
        <div style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid var(--champagne)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Cargando terapeutas...
          </p>
        </div>
      ) : error ? (
        <div style={{ padding: '3rem 1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#ff8ba7' }}>{error}</p>
          <button onClick={fetchMasajistas} className="btn-zen-subtle" style={{ marginTop: '1rem' }}>
            Reintentar
          </button>
        </div>
      ) : masajistas.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          <p style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            No hay masajistas registrados en el sistema
          </p>
          <button
            onClick={handleOpenCreate}
            className="admin-pill-btn"
          >
            Agregar el primero
          </button>
        </div>
      ) : (
        <div className="therapist-grid">
          {masajistas.map((m) => {
            const isDisponible = m.estado === 'disponible';
            const isDeshabilitado = m.estado === 'deshabilitado';

            return (
              <div key={m.id} className="therapist-card">
                <div>
                  <div className="therapist-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="therapist-avatar">
                        {m.fotoUrl ? (
                          <img src={m.fotoUrl} alt={m.nombre} />
                        ) : (
                          m.nombre.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="therapist-name">{m.nombre}</h4>
                        {m.nombreDisplay && (
                          <p className="therapist-display">{m.nombreDisplay}</p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`status-badge status-badge-${
                        isDisponible ? 'confirmada' : isDeshabilitado ? 'completada' : 'pendiente'
                      }`}
                      style={{ fontSize: '0.62rem' }}
                    >
                      <span className="status-badge-dot" />
                      <span>{m.estado}</span>
                    </span>
                  </div>

                  {/* Especialidades */}
                  {m.especialidades && m.especialidades.length > 0 && (
                    <div className="therapist-tags-row">
                      {m.especialidades.map((esp, i) => (
                        <span key={i} className="therapist-tag-pill">
                          {esp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* WhatsApp o Notas */}
                  {m.whatsapp && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 300, margin: '0.25rem 0' }}>
                      WhatsApp: <span style={{ color: 'var(--text-secondary)' }}>{m.whatsapp}</span>
                    </p>
                  )}
                  {m.notas && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 300, marginTop: '0.4rem' }}>
                      &quot;{m.notas}&quot;
                    </p>
                  )}
                </div>

                {/* Footer de Acciones del Terapeuta */}
                <div className="therapist-card-footer">
                  <button
                    onClick={() => handleToggleEstado(m)}
                    disabled={isDeshabilitado}
                    className="booking-action-btn"
                    style={{
                      borderColor: isDisponible ? 'rgba(212, 163, 115, 0.3)' : 'rgba(88, 129, 87, 0.3)',
                      color: isDisponible ? '#e9c49a' : '#a3b18a',
                    }}
                  >
                    {isDisponible ? 'Marcar Ocupado' : 'Marcar Disponible'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleOpenEdit(m)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem' }}
                      title="Editar"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem' }}
                      title="Eliminar o deshabilitar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Zen con Glassmorphism */}
      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3 style={{ fontFamily: "var(--font-serif, 'Cinzel', serif)", fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)' }}>
                {editingMasajista ? 'Editar Terapeuta' : 'Nuevo Terapeuta'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ marginTop: '1.25rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Nombre Interno *
                </label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej: David, Marco"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Nombre Display Público (opcional)
                </label>
                <input
                  type="text"
                  value={formNombreDisplay}
                  onChange={(e) => setFormNombreDisplay(e.target.value)}
                  placeholder="Ej: Marco (Especialista en Rituales Tántricos)"
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">
                    WhatsApp (opcional)
                  </label>
                  <input
                    type="text"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="+51 999 999 999"
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Estado Inicial
                  </label>
                  <select
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value as MasakistaEstado)}
                    className="admin-form-select"
                  >
                    <option value="disponible" style={{ background: '#121814', color: '#f2efe9' }}>Disponible</option>
                    <option value="ocupado" style={{ background: '#121814', color: '#f2efe9' }}>Ocupado</option>
                    <option value="deshabilitado" style={{ background: '#121814', color: '#f2efe9' }}>Deshabilitado</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Especialidades (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formEspecialidades}
                  onChange={(e) => setFormEspecialidades(e.target.value)}
                  placeholder="Relajante, Deportivo, Tántrico, Ceremonial"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Notas Privadas
                </label>
                <textarea
                  rows={2}
                  value={formNotas}
                  onChange={(e) => setFormNotas(e.target.value)}
                  placeholder="Preferencias horarias o notas internas..."
                  className="admin-form-textarea"
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-zen-subtle"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-pill-btn-gold"
                  style={{ opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Guardando...' : editingMasajista ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
