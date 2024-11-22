"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavMenu from '../components/NavMenu/NavMenu';

interface CartItem {
  id_recompensa: number;
  id_producto: string;
  puntosredencion: number;
  cantidad: number;
  subtotalpuntosredencion: number;
  nombre: string;
}

const Carrito: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [codigo, setCodigo] = useState<string>('');

  useEffect(() => {
    const dataString = searchParams.get('data');
    if (dataString) {
      const data = JSON.parse(dataString);
      console.log('Datos recibidos:', data);
      setCartItems(data.detalles || []);
      setUserPoints(data.puntoscanjeado || 0);
      setCodigo(data.codigo || '');
    }
  }, [searchParams]);

  const handleCheckout = async () => {
    const dataToSend = {
      id_usuario: 'us-256de824',
      puntoscanjeado: userPoints,
      codigo: codigo,
      detalles: cartItems,
    };

    try {
      const response = await fetch('http://localhost:3000/redencion/cliente/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      if (response.ok) {
        alert('Redención exitosa!');
        router.push('/historial'); // Puedes redirigir a una página de éxito
      } else {
        alert('Error en la redención');
      }
    } catch (error) {
      console.error('Error en la redención:', error);
      alert('Error en la redención');
    }
  };

  const handleCanjear = () => {
    router.push('/historial');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavMenu />
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
      
      <div className="container mx-auto px-4 py-8 flex">
        <div className="w-3/4">
          <h1 className="text-3xl font-bold mb-6 text-black">Carrito de Compras</h1>
          
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-4 font-bold border-b pb-2 mb-4">
              <span className="text-center">Producto</span>
              <span className="text-center">Puntos</span>
              <span className="text-center">Cantidad</span>
              <span className="text-center">Subtotal</span>
            </div>
            {cartItems.map((item) => (
              <div key={item.id_producto} className="grid grid-cols-4 items-center mb-4 text-black">
                <span className="text-center text-lg font-semibold">{item.nombre}</span>
                <span className="text-center text-lg font-bold">{item.puntosredencion}</span>
                <span className="text-center text-lg font-bold">{item.cantidad}</span>
                <span className="text-center text-lg font-bold">{item.subtotalpuntosredencion}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-1/4 ml-6 bg-white p-4 rounded-lg shadow self-start">
          <div className="flex justify-between mb-2 text-lg text-black">
            <span>Puntos canjeados:</span>
            <span>{userPoints}</span>
          </div>
          <div className="flex justify-between font-bold text-xl mb-4 text-black">
            <span>Total Puntos:</span>
            <span>{userPoints}</span>
          </div>
          <button 
            onClick={handleCheckout} 
            className="w-full px-4 py-2 bg-red-600 text-white text-lg font-bold rounded"
          >
            Canjear
          </button>
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

export default Carrito;








