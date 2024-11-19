"use client";

import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import NavMenu from '../NavMenu/NavMenu';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  tags: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'Paleta de Piña',
    price: 2,
    image: '/api/placeholder/300/300',
    discount: 25,
    tags: ['Paleta', 'Rellenos de Leche']
  },
  {
    id: 2,
    name: 'Paleta de Coco',
    price: 2,
    image: '/api/placeholder/300/300',
    tags: ['Paleta', 'Rellenos de Leche']
  },
  // ...otros productos
];

const CatalogoProductosSuma: React.FC = () => {
  const router = useRouter();

  const handleComprar = () => {
    router.push('/carrito');
  };

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

      {/* Search and Filter */}
      <div className="container mx-auto px-4 flex justify-between items-center mb-8">
        <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded shadow">
          <span className="text-black">Filtrar por categoría</span>
        </button>
        <button className="px-8 py-2 bg-red-600 text-white rounded" onClick={handleComprar}>
          Comprar
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar tu helado"
            className="pl-10 pr-4 py-2 border rounded-lg text-black"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden relative"
            >
              {product.discount && (
                <div className="absolute top-2 right-2 bg-pink-500 text-white text-sm px-2 py-1 rounded-full">
                  -{product.discount}%
                </div>
              )}
              <div className="p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="mt-4 text-lg font-semibold text-black">{product.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-sm rounded-full text-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-black">S/ {product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 flex justify-center space-x-2 mb-8">
        <button className="px-4 py-2 bg-red-600 text-white rounded">1</button>
        <button className="px-4 py-2 bg-gray-200 rounded">2</button>
        <button className="px-4 py-2 bg-gray-200 rounded">3</button>
        <button className="px-4 py-2 bg-gray-200 rounded">Next</button>
      </div>

      {/* Footer */}
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

export default CatalogoProductosSuma;


