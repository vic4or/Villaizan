"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavMenu from '../NavMenu/NavMenu';

interface Product {
  id_recompensa: number;
  puntosnecesarios: number;
  vi_producto: {
    id: string;
    nombre: string;
    precioecommerce: string;
    urlimagen: string;
    descripcion: string;
  };
}

const CatalogoProductosSuma: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [userPoints, setUserPoints] = useState<number>(200); // Puntos iniciales del usuario
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({}); // Productos seleccionados

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/recompensa_puntos/listarTodosProducto');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (productId: string, puntosNecesarios: number) => {
    if (userPoints >= puntosNecesarios) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));
      setUserPoints((prev) => prev - puntosNecesarios);
    } else {
      alert('No tienes suficientes puntos para añadir este producto.');
    }
  };

  const handleRemoveProduct = (productId: string, puntosNecesarios: number) => {
    if (selectedProducts[productId] > 0) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: prev[productId] - 1,
      }));
      setUserPoints((prev) => prev + puntosNecesarios);
    }
  };

  const handleCanjear = () => {
    router.push('/pages/carrito');
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
        <button className="px-8 py-2 bg-red-600 text-white rounded" onClick={handleCanjear}>
          Canjear
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

      {/* User Points */}
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl font-semibold text-black">Puntos disponibles: {userPoints}</h2>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id_recompensa}
              className="bg-white rounded-lg shadow-md overflow-hidden relative"
            >
              <div className="p-4">
                <Image
                  src={product.vi_producto.urlimagen}
                  alt={product.vi_producto.nombre}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => (e.currentTarget.src = '/images/defaultImage.png')} // Cargar una imagen predeterminada en caso de error
                />
                <h3 className="mt-4 text-lg font-semibold text-black">{product.vi_producto.nombre}</h3>
                <p className="mt-2 text-black">{product.vi_producto.descripcion}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-black">Puntos: {product.puntosnecesarios}</span>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handleRemoveProduct(product.vi_producto.id, product.puntosnecesarios)}
                  >
                    -
                  </button>
                  <span className="text-lg text-black">{selectedProducts[product.vi_producto.id] || 0}</span>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => handleAddProduct(product.vi_producto.id, product.puntosnecesarios)}
                  >
                    +
                  </button>
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






