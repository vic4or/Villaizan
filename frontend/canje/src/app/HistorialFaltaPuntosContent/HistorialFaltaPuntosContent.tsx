/* eslint-disable */
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavMenu from '../components/NavMenu/NavMenu';
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
  fechaexpiracion: string;
  codigo: string;
  puntoscanjeado: number;
  vi_detalleredencion: DetalleRedencion[];
}

interface PointEntry {
  date: string;
  dateExp: string;
  code: string;
  type: string;
  pointsRedeemed: number;
  id: string;
  detalles: DetalleRedencion[];
}

const HistorialFaltaPuntosContent: React.FC = () => {
  const [pointsHistory, setPointsHistory] = useState<PointEntry[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = JSON.parse(searchParams.get('user') || '{}');

  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        console.log("Fetching points history for user:", user);

        const response = await baseApi.get(`redencion/cliente/listarPorCanjear/${user.id}`);
        console.log("API Response:", response);

        const data: CanjeItem[] = response.data;

        console.log("Data received:", data);

        const canjeEntries = data.map(item => ({
          date: new Date(item.fechageneracion).toLocaleDateString(),
          dateExp: new Date(item.fechaexpiracion).toLocaleDateString(),
          code: item.codigo,
          type: 'Canje',
          pointsRedeemed: item.puntoscanjeado,
          id: item.id,
          detalles: item.vi_detalleredencion
        }));

        console.log("Mapped entries:", canjeEntries);

        setPointsHistory(canjeEntries);
      } catch (error) {
        console.error("Error fetching points history:", error);
      }
    };

    fetchPointsHistory();
  }, [user.id]);

  const handleViewDetail = (entry: PointEntry) => {
    router.push(`/detallefalta?type=${entry.type}&date=${entry.date}&detalles=${encodeURIComponent(JSON.stringify(entry.detalles))}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <>
          <NavMenu usuario={user} />
          <div className="py-8"></div>

          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-black">PuntosVillaizan - Canjes Pendientes</h1>

            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-red-600 text-white">
                    <th className="py-2">Código</th>
                    <th className="py-2">Fecha Generación</th>
                    <th className="py-2">Fecha Expiración</th>
                    <th className="py-2">Tipo</th>
                    <th className="py-2">Puntos Canjeados</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {pointsHistory.map((entry, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{entry.code}</td>
                      <td className="py-2">{entry.date}</td>
                      <td className="py-2">{entry.dateExp}</td>
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
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Inicio</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Ecommerce</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">LandingPage</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-black">Dirección</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Canjea tus productos aquí: TARAPOTO: Calle Las Dunas cdra 3 Altura de cdra 23 de Av. Alfonso Ugarte Tarapoto</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-600 text-black">
            <p>2023 Helados Villaizan. All rights reserved</p>
          </div>
        </div>
      </footer>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HistorialFaltaPuntosContent;
