'use client';

import React, { useState, useEffect } from 'react';
import { StatsResponse } from '@/types';
import { KpiCard } from './KpiCard';
import { StatusBadge } from './StatusBadge';
import { getLastNMonthPeriods } from '@/lib/booking-utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Calendar, DollarSign, Activity, Sparkles, ChevronDown } from 'lucide-react';

export function StatsPanel() {
  const periods = getLastNMonthPeriods(12);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats(selectedPeriod.year, selectedPeriod.month);
  }, [selectedPeriod]);

  const fetchStats = async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stats?year=${year}&month=${month}`);
      if (!res.ok) {
        throw new Error('No se pudieron cargar las estadísticas');
      }
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const kpi = stats?.kpi;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Selector de Período y Header Editorial */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light, rgba(255,255,255,0.06))' }}>
        <div>
          <span className="section-label" style={{ marginBottom: '0.35rem' }}>
            Métricas de Desempeño
          </span>
          <h2 style={{ fontFamily: "var(--font-serif, 'Cinzel', serif)", fontSize: '1.8rem', fontWeight: 400, color: 'var(--text-primary)' }}>
            Balance del Negocio
          </h2>
        </div>

        {/* Selector minimalista de período */}
        <div className="filter-select-wrap">
          <label htmlFor="period-select" className="sr-only">Seleccionar Período</label>
          <select
            id="period-select"
            value={`${selectedPeriod.year}-${selectedPeriod.month}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split('-').map(Number);
              const found = periods.find((p) => p.year === y && p.month === m);
              if (found) setSelectedPeriod(found);
            }}
            className="filter-select"
          >
            {periods.map((p) => (
              <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`} style={{ background: '#121814', color: '#f2efe9' }}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown className="filter-select-chevron" size={14} />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid var(--champagne)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Sincronizando métricas...
          </p>
        </div>
      ) : error ? (
        <div style={{ padding: '3rem 1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#ff8ba7' }}>{error}</p>
          <button
            onClick={() => fetchStats(selectedPeriod.year, selectedPeriod.month)}
            className="btn-zen-subtle"
            style={{ marginTop: '1rem' }}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          {/* Fila Abierta de Métricas Clave (Sin cajas pesadas) */}
          <div className="kpi-row">
            <KpiCard
              title="Volumen de Citas"
              value={kpi?.totalCitas ?? 0}
              subtitle={`${kpi?.clientesAtendidos ?? 0} clientes atendidos`}
              icon={<Calendar size={16} />}
            />

            <KpiCard
              title="Ingresos Efectivos"
              value={`S/ ${(kpi?.ingresosEfectivos ?? 0).toLocaleString('es-PE')}`}
              subtitle={
                kpi?.ingresosPendientes
                  ? `S/ ${kpi.ingresosPendientes.toLocaleString('es-PE')} por liquidar`
                  : 'Cobrados y completados'
              }
              icon={<DollarSign size={16} />}
            />

            <KpiCard
              title="Cancelaciones"
              value={`${kpi?.tasaCancelacion ?? 0}%`}
              subtitle={`${kpi?.citasCanceladas ?? 0} citas canceladas`}
              icon={<Activity size={16} />}
            />

            <KpiCard
              title="Terapeuta Preferido"
              value={kpi?.masajistaTopNombre ?? '—'}
              subtitle={
                kpi?.masajistaTopCitas
                  ? `${kpi.masajistaTopCitas} sesiones realizadas`
                  : 'Sin citas este mes'
              }
              icon={<Sparkles size={16} />}
            />
          </div>

          {/* Estado de las Citas — Vista Flotante Limpia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Desglose del Ciclo de Reservas
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedPeriod.label}
              </span>
            </div>

            <div className="status-breakdown-grid">
              {(
                [
                  { status: 'pendiente', count: kpi?.citasPendientes ?? 0 },
                  { status: 'confirmada', count: kpi?.citasConfirmadas ?? 0 },
                  { status: 'pagada', count: kpi?.citasPagadas ?? 0 },
                  { status: 'ocurriendo', count: kpi?.citasOcurriendo ?? 0 },
                  { status: 'por_pagar', count: kpi?.citasPorPagar ?? 0 },
                  { status: 'completada', count: kpi?.citasCompletadas ?? 0 },
                  { status: 'cancelada', count: kpi?.citasCanceladas ?? 0 },
                ] as const
              ).map(({ status, count }) => (
                <div key={status} className="status-mini-card">
                  <StatusBadge status={status} size="xs" />
                  <span className="status-mini-num">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráficos Estilizados Minimalistas */}
          <div className="admin-charts-grid">
            {/* Gráfico 1: Evolución Temporal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span className="section-label" style={{ marginBottom: '0.2rem' }}>
                  Tendencia Semestral
                </span>
                <h4 style={{ fontFamily: "var(--font-serif, 'Cinzel', serif)", fontSize: '1.2rem', fontWeight: 400, color: 'var(--text-primary)' }}>
                  Facturación & Demanda
                </h4>
              </div>

              <div style={{ height: '260px', width: '100%', paddingTop: '0.5rem' }}>
                {stats?.monthlyTrend && stats.monthlyTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="champagneGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#cfb78a" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#cfb78a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="mes"
                        stroke="#727e70"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                      />
                      <YAxis
                        stroke="#727e70"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `S/ ${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#121814',
                          borderColor: 'rgba(207, 183, 138, 0.25)',
                          borderRadius: '12px',
                          color: '#f2efe9',
                          fontSize: '11px',
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                          letterSpacing: '0.05em',
                        }}
                        formatter={(val: any, name: any) => [
                          name === 'ingresos' ? `S/ ${val.toLocaleString('es-PE')}` : val,
                          name === 'ingresos' ? 'Facturado' : 'Citas',
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#cfb78a"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#champagneGlow)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Sin historial suficiente
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico 2: Servicios Populares */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span className="section-label" style={{ marginBottom: '0.2rem' }}>
                  Preferencia de Clientes
                </span>
                <h4 style={{ fontFamily: "var(--font-serif, 'Cinzel', serif)", fontSize: '1.2rem', fontWeight: 400, color: 'var(--text-primary)' }}>
                  Rituales Más Solicitados
                </h4>
              </div>

              <div style={{ height: '260px', width: '100%', paddingTop: '0.5rem' }}>
                {stats?.serviceDistribution && stats.serviceDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.serviceDistribution}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <XAxis
                        type="number"
                        stroke="#727e70"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                      />
                      <YAxis
                        type="category"
                        dataKey="serviceName"
                        stroke="#a9b5a7"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#121814',
                          borderColor: 'rgba(207, 183, 138, 0.25)',
                          borderRadius: '12px',
                          color: '#f2efe9',
                          fontSize: '11px',
                          backdropFilter: 'blur(8px)',
                        }}
                        formatter={(val: any) => [`${val} sesiones`, 'Solicitudes']}
                      />
                      <Bar
                        dataKey="count"
                        fill="#cfb78a"
                        radius={[0, 6, 6, 0]}
                        barSize={14}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Sin servicios registrados en este período
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
