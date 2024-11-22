//import CatalogoProductosSuma from '@/app/pages/catalogoProductosSuma';
//import Carrito from '@/components/Carrito/Carrito';
//import HistorialPuntos from '@/components/HistorialPuntos/HistorialPuntos';

"use client";

import React from "react";
import CatalogoProductosSuma from "@/app/catalogo/page"; // Asegúrate de que la ruta sea correcta

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Renderiza el catálogo aquí */}
      <CatalogoProductosSuma />
    </div>
  );
};

export default Page;

