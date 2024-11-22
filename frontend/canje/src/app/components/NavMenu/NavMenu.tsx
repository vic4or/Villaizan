"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // Cambiado a 'next/navigation'

const NavMenu: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="bg-red-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <a onClick={() => handleNavigation('/catalogo')} className="hover:text-gray-200 cursor-pointer">Canje</a>
          <a onClick={() => handleNavigation('/carrito')} className="hover:text-gray-200 cursor-pointer">Carrito</a>
          <a onClick={() => handleNavigation('/historial')} className="hover:text-gray-200 cursor-pointer">HistorialPuntos</a>
          <a href="#" className="hover:text-gray-200">CanjePuntos</a>
        </div>
        <div>
          <span className="text-black">Hola, Usuario!</span>
        </div>
      </div>
    </header>
  );
};

export default NavMenu;
