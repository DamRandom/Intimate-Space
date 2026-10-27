'use client';

import React from 'react';

export interface LoadingSpinnerProps {
  /** If true, renders full screen with backdrop */
  fullScreen?: boolean;
  /** Size of the spinner ring */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Primary title or brand heading */
  text?: string;
  /** Secondary status text under the title */
  subtext?: string;
  /** Whether to show the central EI monogram */
  showLogo?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  size = 'md',
  text,
  subtext,
  showLogo = true,
  className = '',
}) => {
  // Size dimensions in pixels for the ring
  const dimensionsMap: Record<string, { ringSize: number; stroke: number; fontSize: string }> = {
    xs: { ringSize: 20, stroke: 2, fontSize: '0.6rem' },
    sm: { ringSize: 32, stroke: 2.5, fontSize: '0.75rem' },
    md: { ringSize: 64, stroke: 3, fontSize: '1rem' },
    lg: { ringSize: 96, stroke: 3.5, fontSize: '1.25rem' },
    xl: { ringSize: 120, stroke: 4, fontSize: '1.5rem' },
  };

  const currentSize = dimensionsMap[size] || dimensionsMap.md;
  const { ringSize, stroke, fontSize } = currentSize;
  const radius = (ringSize - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const content = (
    <div
      className={`zen-spinner-box zen-spinner-${size} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={text || subtext || 'Cargando contenido...'}
    >
      {/* Ambient glowing aura for md/lg sizes */}
      {(size === 'md' || size === 'lg' || size === 'xl') && (
        <div className="zen-spinner-aura" aria-hidden="true" />
      )}

      {/* Concentric Luxury Dual-Ring Graphic */}
      <div
        className="zen-spinner-graphic"
        style={{ width: ringSize, height: ringSize }}
      >
        <svg
          className="zen-spinner-svg"
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          width={ringSize}
          height={ringSize}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background track */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(207, 183, 138, 0.12)"
            strokeWidth={stroke}
          />
          {/* Outer primary rotating gradient arc */}
          <circle
            className="zen-spinner-arc-outer"
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="url(#champagne-gradient)"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.35}
            strokeLinecap="round"
          />
          {/* Inner counter-rotating decorative ring (for sm/md/lg) */}
          {size !== 'xs' && (
            <circle
              className="zen-spinner-arc-inner"
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius * 0.7}
              fill="none"
              stroke="rgba(207, 183, 138, 0.45)"
              strokeWidth={Math.max(1, stroke * 0.65)}
              strokeDasharray={`${circumference * 0.2} ${circumference * 0.15}`}
              strokeLinecap="round"
            />
          )}

          <defs>
            <linearGradient id="champagne-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cfb78a" stopOpacity="1" />
              <stop offset="50%" stopColor="#e6d7ba" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#cfb78a" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Monogram EI (for md, lg, xl sizes) */}
        {showLogo && (size === 'md' || size === 'lg' || size === 'xl') && (
          <div className="zen-spinner-monogram" style={{ fontSize }}>
            <span>EI</span>
          </div>
        )}
      </div>

      {/* Text labels */}
      {(text || subtext) && (
        <div className="zen-spinner-text-wrap">
          {text && <h4 className="zen-spinner-title">{text}</h4>}
          {subtext && <p className="zen-spinner-subtext">{subtext}</p>}
          
          {/* Shimmer line under text in fullScreen or lg sizes */}
          {(fullScreen || size === 'lg' || size === 'xl') && (
            <div className="zen-spinner-shimmer-line" aria-hidden="true">
              <div className="zen-spinner-shimmer-spark" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="zen-spinner-fullscreen-overlay">
        {content}
      </div>
    );
  }

  return content;
};
