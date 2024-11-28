import React from "react";
import { useSession } from "next-auth/react"; // Importa useSession
import CatalogoProductosSuma from "@/app/catalogo/page"; // Asegúrate de que la ruta sea correcta
import {useEffect} from "react";

const Page: React.FC = () => {
  const { data: session } = useSession(); // Obtén la sesión de autenticación
  useEffect(() => {
    if (session) {
      console.log(session);
    }
  })
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Verifica si el usuario está autenticado */}
      {session ? (
        <>
          <p className="text-center text-green-700 font-bold">
            Bienvenido, {session.user?.name}
          </p>
          {/* Renderiza el catálogo solo si el usuario está autenticado */}
          <CatalogoProductosSuma />
        </>
      ) : (
        <p className="text-center text-red-500 font-bold">
          Por favor, inicia sesión para acceder al catálogo.
        </p>
      )}
    </div>
  );
};

export default Page;


