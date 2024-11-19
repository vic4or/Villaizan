"use client";

import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import NavMenu from '../NavMenu/NavMenu';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount?: number;
}

const cartItems: CartItem[] = [
  {
    id: 1,
    name: 'Helado de Mango',
    price: 2,
    quantity: 10,
    image: '/api/placeholder/300/300',
    discount: 5,
  },
  {
    id: 2,
    name: 'Helado de Coco',
    price: 2,
    quantity: 5,
    image: '/api/placeholder/300/300',
  },
];

const Carrito: React.FC = () => {
  const router = useRouter();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      return item.discount ? total + item.price * item.quantity * (item.discount / 100) : total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = subtotal - discount;

  const handleCheckout = () => {
    router.push('/checkout');
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
            <div className="grid grid-cols-5 font-bold border-b pb-2 mb-4">
              <span className="text-center">Imagen</span>
              <span className="text-center">Producto</span>
              <span className="text-center">Precio</span>
              <span className="text-center">Cantidad</span>
              <span className="text-center">Subtotal</span>
              <span className="text-center">Acciones</span>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-5 items-center mb-4 text-black">
                <div className="flex justify-center">
                  <Image src={item.image} alt={item.name} width={100} height={100} className="rounded-lg" />
                </div>
                <span className="text-center text-lg font-semibold">{item.name}</span>
                <span className="text-center text-lg font-bold">S/ {item.price}</span>
                <span className="text-center text-lg font-bold">{item.quantity}</span>
                <span className="text-center text-lg font-bold">S/ {item.price * item.quantity}</span>
                <div className="flex justify-center">
                  <button className="ml-4 text-red-600 text-2xl">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-1/4 ml-6 bg-white p-4 rounded-lg shadow self-start">
          <div className="flex justify-between mb-2 text-lg text-black">
            <span>Subtotal:</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-lg text-black">
            <span>Descuento:</span>
            <span>-S/ {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl mb-4 text-black">
            <span>Total:</span>
            <span>S/ {total.toFixed(2)}</span>
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





