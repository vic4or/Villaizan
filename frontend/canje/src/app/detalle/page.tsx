"use client";

import React from 'react';
//import Image from 'next/image';
import NavMenu from '../components/NavMenu/NavMenu';
import SuspenseWrapper from '../components/SuspenseWrapper/SuspenseWrapper'; 
import DetalleContent from '../components/DetalleContent/DetalleContent'; // Importa el nuevo componente
//import Banner from '../components/Banner/Banner';

const Detalle: React.FC = () => {
  return (
    <SuspenseWrapper>
      <div className="min-h-screen bg-gray-50">
        <NavMenu />
        {/* Logo */}
        {/*<Banner></Banner>*/}
        <div className="py-8"></div>

        <DetalleContent /> {/* Usamos el nuevo componente aquí */}

        {/*<footer className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-bold mb-4 text-black">Helados Villaizan</h4>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-black">Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Carro</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Catálogo</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Acerca</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Contacto</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-black">Ayuda</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Opciones de Pago</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Returns</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Privacy Policies</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Libro de Reclamaciones</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-600 text-black">
              <p>2023 Helados Villaizan. All rights reserved</p>
            </div>
          </div>
        </footer>*/}
      </div>
    </SuspenseWrapper>
  );
};

export default Detalle;




