"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavMenu from '../components/NavMenu/NavMenu';
import baseApi from '../api/mainAxios.api';

interface ViProducto {
    nombre: string;
  }
  
  interface DetallePuntosAcumulados {
    vi_producto: ViProducto;
    puntosporunidad: number;
    cantidad: number;
    subtotalpuntos: number;
  }
  
  interface DetalleRedencion {
    vi_producto: ViProducto;
    puntosredencion: number;
    cantidad: number;
    subtotalpuntosredencion: number;
  }
  
  interface CompraItem {
    id: string;
    fechatransaccion: string;
    cantidadpuntosganados: number;
    vi_detallepuntosacumulados: DetallePuntosAcumulados[];
  }
  
  interface CanjeItem {
    id: string;
    fecharedencion: string;
    puntoscanjeado: number;
    vi_detalleredencion: DetalleRedencion[];
  }
  
  interface PointEntry {
    date: string;
    type: string;
    pointsEarned?: number | null;
    pointsRedeemed?: number | null;
    id: string;
    detalles: DetallePuntosAcumulados[] | DetalleRedencion[]; // detalles puede ser de cualquier tipo
  }

const HistorialPuntosContent: React.FC = () => {
  const [pointsHistory, setPointsHistory] = useState<PointEntry[]>([]);
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = JSON.parse(searchParams.get('user') || '{}');
    console.log("Usuario en historial:",user)
  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        const [compraResponse, canjeResponse] = await Promise.all([
          baseApi.get(`puntosacumulados/cliente/listarTodos/${user.id}`),
          baseApi.get(`redencion/cliente/listarCanjeados/${user.id}`)
        ]);
        console.log("Id del usuario:",user.id)
        const compraData: CompraItem[] = compraResponse.data;
        const canjeData: CanjeItem[] = canjeResponse.data;

        const pointsEarned = compraData.reduce((acc, item) => acc + item.cantidadpuntosganados, 0);
        setAccumulatedPoints(pointsEarned);

        const compraEntries = compraData.map(item => ({
          date: new Date(item.fechatransaccion).toLocaleDateString(),
          type: 'Compra',
          pointsEarned: item.cantidadpuntosganados,
          pointsRedeemed: null,
          id: item.id,
          detalles: item.vi_detallepuntosacumulados
        }));

        const canjeEntries = canjeData.map(item => ({
          date: new Date(item.fecharedencion).toLocaleDateString(),
          type: 'Canje',
          pointsEarned: null,
          pointsRedeemed: item.puntoscanjeado,
          id: item.id,
          detalles: item.vi_detalleredencion
        }));

        setPointsHistory([...compraEntries, ...canjeEntries]);
      } catch (error) {
        console.error("Error fetching points history:", error);
      }
    };

    fetchPointsHistory();
  }, [user.id]);

  const handleViewDetail = (entry: PointEntry) => {
    router.push(`/detalle?type=${entry.type}&date=${entry.date}&detalles=${encodeURIComponent(JSON.stringify(entry.detalles))}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <>
          <NavMenu usuario={user} />
          <div className="py-8"></div>

          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-black">PuntosVillaizan</h1>
            <p className="text-lg mb-4 text-black">
              ¡Tienes <span className="text-yellow-500">{accumulatedPoints}</span> puntos acumulados!
            </p>

            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-red-600 text-white">
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Tipo</th>
                    <th className="py-2">Puntos ganados</th>
                    <th className="py-2">Puntos canjeados</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {pointsHistory.map((entry, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{entry.date}</td>
                      <td className="py-2">{entry.type}</td>
                      <td className="py-2">{entry.pointsEarned !== null ? entry.pointsEarned : '-'}</td>
                      <td className="py-2">{entry.pointsRedeemed !== null ? entry.pointsRedeemed : '-'}</td>
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
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-black">Dirección</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-black">Canjea tus productos aquí: <strong>Tarapoto</strong>: Calle Las Dunas cdra 3 Altura de cdra 23 de Av. Alfonso Ugarte Tarapoto</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-600 text-black">
            <p>2024 Helados Villaizan. All rights reserved</p>
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

export default HistorialPuntosContent;
