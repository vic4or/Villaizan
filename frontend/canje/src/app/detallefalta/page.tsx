"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
//import Image from 'next/image';
import NavMenu from '../components/NavMenu/NavMenu';
import Banner from '../components/Banner/Banner';

interface ProductDetail {
  nombre: string;
  puntos: number;
  cantidad: number;
  subtotal: number;
}

interface ViProducto {
  nombre: string;
}

interface DetalleItem {
  vi_producto: ViProducto;
  puntosredencion: number;
  cantidad: number;
  subtotalpuntosredencion: number;
}

const DetalleFaltaContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [transactionType, setTransactionType] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>('');

  useEffect(() => {
    const type = searchParams.get('type');
    const date = searchParams.get('date');
    const detallesString = searchParams.get('detalles');

    if (type && date && detallesString) {
      setTransactionType(type);
      setTransactionDate(date);

      const detalles = JSON.parse(decodeURIComponent(detallesString)) as DetalleItem[];
      const mappedDetails = detalles.map((item) => ({
        nombre: item.vi_producto.nombre,
        puntos: item.puntosredencion,
        cantidad: item.cantidad,
        subtotal: item.subtotalpuntosredencion,
      }));
      
      setProductDetails(mappedDetails);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavMenu />
      {/* Logo */}
      <Banner></Banner>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-black">Historial de {transactionType}</h1>
        <p className="text-lg mb-4 text-black">Fecha: {transactionDate}</p>
        
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-red-600 text-white">
                <th className="py-2">Producto</th>
                <th className="py-2">Puntos</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {productDetails.map((detail, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{detail.nombre}</td>
                  <td className="py-2">{detail.puntos}</td>
                  <td className="py-2">{detail.cantidad}</td>
                  <td className="py-2">{detail.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="bg-white py-8">
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
      </footer>
    </div>
  );
};

const DetalleFalta: React.FC = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DetalleFaltaContent />
    </Suspense>
  );
};

export default DetalleFalta;


