"use client";

import React, { Suspense } from 'react';
import HistorialPuntosContent from '@/app/HistorialPuntosContent/HistorialPuntosContent';

const HistorialPuntos: React.FC = () => {
  return (
    <Suspense fallback={<p>Loading historial...</p>}>
      <HistorialPuntosContent />
    </Suspense>
  );
};

export default HistorialPuntos;









