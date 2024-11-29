/* eslint-disable */
"use client";

import React from 'react';
import Image from 'next/image';
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
    <header className="bg-red-600 text-white p-4" style={{ backgroundColor: '#BD181E' }}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image 
            src="/images/logo2.png" 
            alt="Logo" 
            width={60} 
            height={60}
            className="cursor-pointer" // Ajusta la altura y ancho de la imagen
            onClick={() => handleNavigation('/')}
          />
        </div>
        <div className="flex space-x-4">
          <a 
            onClick={() => handleNavigation('/catalogo')}
            className="hover:text-gray-200 cursor-pointer"
            style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
          >
            Catálogo
          </a>
          <a 
            onClick={() => handleNavigation(`/historial?user=${encodeURIComponent(JSON.stringify(usuario))}`)}
            className="hover:text-gray-200 cursor-pointer"
            style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
          >
            Historial Puntos
          </a>
          <a 
            onClick={() => handleNavigation(`/historialfalta?user=${encodeURIComponent(JSON.stringify(usuario))}`)}
            className="hover:text-gray-200 cursor-pointer"
            style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
          >
            Historial Puntos Por Canjear
          </a>
        </div>
        <div>
          <span className="font-semibold" style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif' }}>
            Hola, {usuario.name}!
          </span>
        </div>
      </div>
    </header>
  );
};

export default NavMenu;







