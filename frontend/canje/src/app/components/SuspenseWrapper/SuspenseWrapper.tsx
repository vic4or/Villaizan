import React, { ReactNode, Suspense } from 'react';

// Definición de las props del componente SuspenseWrapper
interface SuspenseWrapperProps {
  children: ReactNode;
}

// Componente de suspense básico para mostrar un fallback mientras se cargan los datos
const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ children }) => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;

