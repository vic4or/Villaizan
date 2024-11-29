/* eslint-disable */
"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // Cambiado a 'next/navigation'

interface NavMenuProps {
  usuario: any; // O el tipo adecuado para el usuario
}

const NavMenu: React.FC<NavMenuProps> = ({ usuario }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="bg-red-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <a 
            onClick={() => handleNavigation('/catalogo')}
            className="hover:text-gray-200 cursor-pointer text-white font-semibold"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Catálogo
          </a>
          <a 
            onClick={() => handleNavigation(`/historial?user=${encodeURIComponent(JSON.stringify(usuario))}`)}
            className="hover:text-gray-200 cursor-pointer text-white font-semibold"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Historial Puntos
          </a>
          <a 
            onClick={() => handleNavigation(`/historialfalta?user=${encodeURIComponent(JSON.stringify(usuario))}`)}
            className="hover:text-gray-200 cursor-pointer text-white font-semibold"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Historial Puntos Por Canjear
          </a>
        </div>
        <div>
          <span className="text-white font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>
            Hola, {usuario.name}!
          </span>
        </div>
      </div>
    </header>
  );
};

export default NavMenu;


