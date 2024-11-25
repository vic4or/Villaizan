"use client";

import React, { useEffect, useState } from 'react';
//import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NavMenu from '../components/NavMenu/NavMenu';
import Banner from '../components/Banner/Banner';
import baseApi from '../api/mainAxios.api';

interface ViProducto {
  nombre: string;
}

interface DetalleRedencion {
  vi_producto: ViProducto;
  puntosredencion: number;
  cantidad: number;
  subtotalpuntosredencion: number;
}

interface CanjeItem {
  id: string;
  fechageneracion: string;
  puntoscanjeado: number;
  vi_detalleredencion: DetalleRedencion[];
}

interface PointEntry {
  date: string;
  type: string;
  pointsRedeemed: number;
  id: string;
  detalles: DetalleRedencion[];
}

const HistorialFalta: React.FC = () => {
  const [pointsHistory, setPointsHistory] = useState<PointEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        const response = await baseApi.get('redencion/cliente/listarPorCanjear/us-256de824');
        const data: CanjeItem[] = response.data;
  
        const canjeEntries = data.map(item => ({
          date: new Date(item.fechageneracion).toLocaleDateString(),
          type: 'Canje',
          pointsRedeemed: item.puntoscanjeado,
          id: item.id,
          detalles: item.vi_detalleredencion
        }));
  
        setPointsHistory(canjeEntries);
      } catch (error) {
        console.error("Error fetching points history:", error);
      }
    };
  
    fetchPointsHistory();
  }, []);
  

  const handleViewDetail = (entry: PointEntry) => {
    router.push(`/detallefalta?type=${entry.type}&date=${entry.date}&detalles=${encodeURIComponent(JSON.stringify(entry.detalles))}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavMenu />
      {/* Logo */}
      <Banner></Banner>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-black">PuntosVillaizan - Canjes Pendientes</h1>
        
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-red-600 text-white">
                <th className="py-2">Fecha Generación</th>
                <th className="py-2">Tipo</th>
                <th className="py-2">Puntos Canjeados</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody className="text-black">
              {pointsHistory.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{entry.date}</td>
                  <td className="py-2">{entry.type}</td>
                  <td className="py-2">{entry.pointsRedeemed}</td>
                  <td className="py-2">
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded"
                      onClick={() => handleViewDetail(entry)}
                    >
                      VER DETALLE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-black">
          <span>Filas por página:</span>
          <select className="border rounded px-2 py-1">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span> 1-{pointsHistory.length} de {pointsHistory.length} </span>
          <button className="px-2 py-1 border rounded bg-gray-200 text-black">{'<'}</button>
          <button className="px-2 py-1 border rounded bg-gray-200 text-black">{'>'}</button>
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

export default HistorialFalta;

