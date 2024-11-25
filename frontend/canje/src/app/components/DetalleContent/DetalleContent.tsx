"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
//import Image from 'next/image';
//import NavMenu from '../NavMenu/NavMenu';

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
  puntosporunidad?: number;
  puntosredencion?: number;
  cantidad: number;
  subtotalpuntos?: number;
  subtotalpuntosredencion?: number;
}

const DetalleContent: React.FC = () => {
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

      const detalles = JSON.parse(detallesString) as DetalleItem[];
      const mappedDetails = detalles.map((item) => ({
        nombre: item.vi_producto.nombre,
        puntos: type === 'Compra' ? item.puntosporunidad! : item.puntosredencion!,
        cantidad: item.cantidad,
        subtotal: type === 'Compra' ? item.subtotalpuntos! : item.subtotalpuntosredencion!,
      }));

      setProductDetails(mappedDetails);
    }
  }, [searchParams]);

  return (
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
  );
};

export default DetalleContent;
