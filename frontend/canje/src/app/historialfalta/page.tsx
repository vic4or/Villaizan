"use client";

import React, { Suspense } from 'react';
import HistorialFaltaPuntosContent from '@/app/HistorialFaltaPuntosContent/HistorialFaltaPuntosContent';

const HistorialFaltaPuntos: React.FC = () => {
  return (
    <Suspense fallback={<p>Loading historial...</p>}>
      <HistorialFaltaPuntosContent />
    </Suspense>
  );
};

export default HistorialFaltaPuntos;

