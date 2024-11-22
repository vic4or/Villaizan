"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NavMenu from '../components/NavMenu/NavMenu';

interface PointEntry {
  date: string;
  type: string;
  pointsEarned?: number | null;
  pointsRedeemed?: number | null;
}

const HistorialPuntos: React.FC = () => {
  const [pointsHistory, setPointsHistory] = useState<PointEntry[]>([]);
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(0);

  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        const [compraResponse, canjeResponse] = await Promise.all([
          fetch('http://localhost:3000/puntosacumulados/cliente/listarTodos/us-256de824'),
          fetch('http://localhost:3000/redencion/cliente/listarCanjeados/us-256de824')
        ]);

        const compraData = await compraResponse.json();
        const canjeData = await canjeResponse.json();

        const pointsEarned = compraData.reduce((acc: number, item: any) => acc + item.cantidadpuntosganados, 0);
        setAccumulatedPoints(pointsEarned);

        const compraEntries = compraData.map((item: any) => ({
          date: new Date(item.fechatransaccion).toLocaleDateString(),
          type: 'Compra',
          pointsEarned: item.cantidadpuntosganados,
          pointsRedeemed: null
        }));

        const canjeEntries = canjeData.map((item: any) => ({
          date: new Date(item.fecharedencion).toLocaleDateString(),
          type: 'Canje',
          pointsEarned: null,
          pointsRedeemed: item.puntoscanjeado
        }));

        setPointsHistory([...compraEntries, ...canjeEntries]);
      } catch (error) {
        console.error("Error fetching points history:", error);
      }
    };

    fetchPointsHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavMenu />
      {/* Logo */}
      <div style={{ position: 'relative', width: '100%', height: '300px' }}>
        <Image
          src="/images/bannerFlujoCompra.png"
          alt="Villaizan Logo"
          width={1920}
          height={1080}
          style={{
            width: '100%',
            height: 'auto',
          }}
          priority
        />
      </div>
      
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
                    <button className="px-4 py-2 bg-red-600 text-white rounded">VER DETALLE</button>
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
          <span> 1-4 de {pointsHistory.length} </span>
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

export default HistorialPuntos;


