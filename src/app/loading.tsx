import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <LoadingSpinner
      fullScreen
      size="lg"
      text="ESPACIO ÍNTIMO"
      subtext="Cargando tu santuario de bienestar..."
      showLogo
    />
  );
}
