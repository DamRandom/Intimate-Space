'use client';

import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: KpiCardProps) {
  return (
    <div className="kpi-column">
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <span className="kpi-label">{title}</span>
          {icon && <div className="kpi-icon-wrap">{icon}</div>}
        </div>
        <div className="kpi-num">{value}</div>
        {subtitle && <p className="kpi-sub">{subtitle}</p>}
      </div>

      {trend && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ color: trend.isPositive ? '#a3b18a' : '#ff8ba7', fontWeight: 500 }}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{trend.label || 'vs mes anterior'}</span>
        </div>
      )}
    </div>
  );
}
