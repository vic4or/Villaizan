/* eslint-disable */
"use client";

import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NavMenu from '../components/NavMenu/NavMenu';
import { getRecompensaPuntos } from '../api/recompensaPuntos.api';

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

// Función para generar un código aleatorio de 3 letras y 5 números
const generateRandomCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = '';
  
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  for (let i = 0; i < 6; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return result;
};

const CatalogoProductosSuma: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0); // Puntos iniciales del usuario
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({}); // Productos seleccionados
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda
  const [currentPage, setCurrentPage] = useState<number>(1); // Estado para la página actual
  const [showInstructions, setShowInstructions] = useState<boolean>(false); // Estado para mostrar las instrucciones
  // Obtener el objeto guardado desde LocalStorage
  const [user, setUser] = useState(null);
  const [codigo, setCodigo] = useState(null);

  useEffect(() => {
    // Verificar si estamos en el cliente (browser)
    if (typeof window !== 'undefined') {
      const usuarioGuardado = localStorage.getItem('user');
      if (usuarioGuardado) {
        const usuarioParsed = JSON.parse(usuarioGuardado);
        setUser(usuarioParsed);
        console.log("usuario:", user);
        console.log("usuarioParsed:", usuarioParsed);
        setCodigo(usuarioParsed.id);
        setUserPoints(usuarioParsed.db_info.puntosacumulados);
      } else {
        console.log('No se encontró el usuario en LocalStorage');
      }
    }
  }, []);

  useEffect(() => {
    async function carga() {
      const datos = await getRecompensaPuntos();
      setProducts(datos);
    }
    carga();
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
    const selectedProductsData = Object.entries(selectedProducts).map(([id, quantity]) => {
      const product = products.find(p => p.vi_producto.id === id);
      if (product) {
        return {
          id_recompensa: product.id_recompensa,
          id_producto: product.vi_producto.id,
          puntosredencion: product.puntosnecesarios,
          cantidad: quantity,
          subtotalpuntosredencion: product.puntosnecesarios * quantity,
          nombre: product.vi_producto.nombre,
        };
      }
      return null;
    }).filter(item => item !== null);

    const dataToSend = {
      id_usuario: codigo, // Completar esta parte
      puntoscanjeado: selectedProductsData.reduce((sum, product) => sum + (product ? product.subtotalpuntosredencion : 0), 0),
      codigo: generateRandomCode(),
      detalles: selectedProductsData,
      user: user // Pasar el objeto user completo
    };

    // Convertimos los datos a una cadena de consulta (query string)
    const queryString = new URLSearchParams({
      data: JSON.stringify(dataToSend)
    }).toString();

    // Navegar a la página de carrito con los productos, los puntos y el usuario en la URL
    router.push(`/carrito?${queryString}`);
  };

  const filteredProducts = useMemo(() => {
    // Filtrar productos basados en el término de búsqueda
    return products.filter(product => 
      product.vi_producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Calcular el número de páginas basado en el número de productos
  const totalPages = Math.ceil(filteredProducts.length / 8);

  // Obtener los productos para la página actual
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * 8;
    const endIndex = startIndex + 8;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const handleNavigationToHistorial = () => {
    const queryString = new URLSearchParams({
      user: JSON.stringify(user)
    }).toString();

    router.push(`/historial?${queryString}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <>
          <NavMenu usuario={user} />
          <div className="py-8"></div>

          {/* Search and Filter */}
          <div className="container mx-auto px-4 flex justify-between items-center mb-8">
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded shadow"
              onClick={() => setShowInstructions(true)} // Mostrar las instrucciones al hacer clic
            >
              <span className="text-black">Instrucciones</span>
            </button>
            <button
              onClick={handleCanjear}  // Usar la función handleCanjear aquí para navegar
              className="px-8 py-2 bg-red-600 text-white rounded"
            >
              Ver Productos
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar tu helado"
                className="pl-10 pr-4 py-2 border rounded-lg text-black"
                value={searchTerm} // Asignar el valor del término de búsqueda al input
                onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda al escribir
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
            <h2 className="text-2xl font-semibold text-black">Tienes {userPoints} puntos</h2>
          </div>

   {/* Products Grid */}
<div className="container mx-auto px-4 mb-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {paginatedProducts.map((product) => (
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
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg text-black">Canjealo por <strong>{product.puntosnecesarios}</strong> puntos</span>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 text-white rounded" // Color gris tenue para el botón "-"
              onClick={() => handleRemoveProduct(product.vi_producto.id, product.puntosnecesarios)}
            >
              -
            </button>
            <span className="text-lg text-black">{selectedProducts[product.vi_producto.id] || 0}</span>
            <button
              className="px-4 py-2 bg-gray-300 text-white rounded" // Color gris tenue para el botón "+"
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
  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'} rounded`}
      onClick={() => setCurrentPage(index + 1)}
    >
      {index + 1}
    </button>
  ))}
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

{/* Pop-up de Instrucciones */}
{showInstructions && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
      <div className="bg-red-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Instrucciones</h2>
          <button
            onClick={() => setShowInstructions(false)}
            className="text-white text-3xl"
          >
            &times;
          </button>
        </div>
      </div>
      <div className="p-6">
        <p className="mb-4 text-black">
          Tienes un total de {userPoints} puntos disponibles. Para seleccionar una recompensa:
        </p>
        <ol className="list-decimal list-inside mb-4 text-black space-y-4">
          <li className="text-lg">
            Busca el helado que deseas canjear usando el campo de búsqueda o navegando por la lista.
            {/*<span className="text-sm block mt-1 text-gray-700">(Cada helado muestra la cantidad de puntos necesarios para canjearlo)</span>*/}
          </li>
          <li className="text-lg">
            Para añadir un helado a tu selección, haz clic en el botón verde (+). Si deseas quitarlo, haz clic en el botón rojo (-).
            {/*<span className="text-sm block mt-1 text-gray-700">(La cantidad seleccionada de cada helado se mostrará entre los botones (+) y (-))</span>*/}
          </li>
          <li className="text-lg">
            Una vez hayas seleccionado todas tus recompensas, haz clic en el botón "Ver Productos" para revisar tu carrito.
          </li>
        </ol>
        <h3 className="text-xl font-semibold mb-2 text-black">Carrito de Recompensas</h3>
        <p className="list-decimal list-inside mb-4 text-black space-y-4 text-lg">
          4. En el carrito, verás las recompensas seleccionadas con su precio por unidad, cantidad y subtotal. Si deseas canjear con esas recompensas escogidas, haz clic en el botón "Canjear".
        </p>
      </div>
    </div>
  </div>
  
)}
<div className="py-8"></div>
</>
) : (
  <p>Loading...</p>
)}
</div>
);
};

export default CatalogoProductosSuma;
