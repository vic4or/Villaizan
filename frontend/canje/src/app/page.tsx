"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react"; // Importa useSession
//import CatalogoProductosSuma from "@/app/catalogo/page"; // Asegúrate de que la ruta sea correcta

const Page: React.FC = () => {
  // Usa los hooks incondicionalmente
  const { data: session } = useSession(); // Obtén la sesión de autenticación

  useEffect(() => {
    if (session) {
      console.log(session);
    }
  }, [session]); // Añade la dependencia `session`

  // Maneja la lógica condicional después de los hooks
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <p className="text-center text-red-500 font-bold">
          Por favor, inicia sesión para acceder al catálogo.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <p className="text-center text-green-700 font-bold">
        Bienvenido, {session.user?.name}
      </p>
      {/* Renderiza el catálogo solo si el usuario está autenticado */}
      {/*<CatalogoProductosSuma />*/}
    </div>
  );
};

export default Page;




