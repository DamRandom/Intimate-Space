'use client';

import React from 'react';
import { BookingStatus } from '@/types';
import { STATUS_CONFIG } from '@/lib/booking-utils';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'xs' | 'sm' | 'md';
  showDot?: boolean;
}

export function StatusBadge({ status, size = 'sm', showDot = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    description: '',
  };

  const statusClass = `status-badge-${status}`;

  return (
    <span
      title={config.description}
      className={`status-badge ${statusClass}`}
    >
      {showDot && <span className="status-badge-dot" />}
      <span>{config.label}</span>
    </span>
  );
}
