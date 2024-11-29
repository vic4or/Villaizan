/* eslint-disable */
"use client";

import React,{useState,useEffect} from 'react';
import { useRouter } from 'next/navigation'; // Cambiado a 'next/navigation'

interface NavMenuProps {
  usuario: any; // O el tipo adecuado para el usuario
}

const NavMenu: React.FC<NavMenuProps> = ({ usuario }) => {
  const router = useRouter();
  const [user,setUser] = useState(null);
  const [usuarioParsed,setUsuarioParsed] = useState(null);
  useEffect(() => {
    // Verificar si estamos en el cliente (browser)
    if (typeof window !== 'undefined') {
      const usuarioGuardado = localStorage.getItem('user');
      if (usuarioGuardado) {
        setUsuarioParsed(JSON.parse(usuarioGuardado));
        setUser(usuarioParsed);
        console.log("usuario:",user)
        console.log("usuarioParsed:",usuarioParsed)
      } else {
        console.log('No se encontró el usuario en LocalStorage');
      }
    }
  }, []);
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="bg-red-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <a onClick={() => handleNavigation('/catalogo')} className="hover:text-gray-200 cursor-pointer">Catalogo</a>
          <a onClick={() => handleNavigation('/carrito')} className="hover:text-gray-200 cursor-pointer">Carrito</a>
          <a onClick={() => handleNavigation('/historial')} className="hover:text-gray-200 cursor-pointer">HistorialPuntos</a>
          <a onClick={() => handleNavigation('/historialfalta')} className="hover:text-gray-200 cursor-pointer">HistorialPuntosPorCanjear</a>
        </div>
        <div>
          <span className="text-black">Hola, {usuario.name}!</span>
        </div>
      </div>
    </header>
  );
};

export default NavMenu;
