/* eslint-disable */
"use client";

//import Image from 'next/image';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavMenu from '../components/NavMenu/NavMenu';
//import Banner from '../components/Banner/Banner';
import baseApi from '../api/mainAxios.api';

interface CartItem {
  id_recompensa: number;
  id_producto: string;
  puntosredencion: number;
  cantidad: number;
  subtotalpuntosredencion: number;
  nombre: string;
}

const CarritoContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [codigo, setCodigo] = useState<string>('');
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

  useEffect(() => {
    if (searchParams) {
      const dataString = searchParams.get('data');
      if (dataString) {
        const data = JSON.parse(dataString);
        console.log('Datos recibidos:', data);
        setCartItems(data.detalles || []);
        setUserPoints(data.puntoscanjeado || 0);
        setCodigo(data.codigo || '');
      }
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
      console.log('Sending data:', dataToSend); // Debugging: Log the data being sent
      const response = await baseApi.post('redencion/cliente/crear', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Response:', response); // Debugging: Log the response
  
      if (response.status === 200 || response.status === 201) { // Check the status code
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
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      <NavMenu usuario={user} />
      {/*<Banner></Banner>*/}
      <div className="py-8"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-6">
          <div className="w-full md:w-[70%] p-6 bg-white rounded-lg shadow mb-6">
            <div className="grid grid-cols-4 font-bold border-b pb-2 mb-4">
              <span className="text-center text-black">Producto</span>
              <span className="text-center text-black">Puntos por unidad</span>
              <span className="text-center text-black">Cantidad</span>
              <span className="text-center text-black">Subtotal de puntos</span>
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

          <div className="w-full md:w-[25%] p-6 bg-white rounded-lg shadow self-start">
            <div className="flex justify-between font-bold text-xl mb-4 text-black">
              <span>Total Puntos:</span>
              <span>{userPoints}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              className="w-full px-4 py-2 bg-red-600 text-white text-lg font-bold rounded hover:bg-red-700 transition-colors"
            >
              Canjear
            </button>
          </div>
        </div>
      </div>

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
  );
};

const Carrito: React.FC = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CarritoContent />
    </Suspense>
  );
};

export default Carrito;











