/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import CatalogoProductosSuma from "@/app/catalogo/page"; // Asegúrate de que la ruta sea correcta

const Page: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "loading") {
      // Verificar si la sesión está autenticada
      //@ts-ignore
      if (session?.user?.db_info?.id) {
        setIsAuthenticated(true);
        //@ts-ignore
        setUserId(session.user.db_info.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        // Redirigir al login si no está autenticado
        const callbackUrl = encodeURIComponent("https://heladosvillaizan.tech/");
        window.location.href = `https://landing.heladosvillaizan.tech/login?callbackUrl=${callbackUrl}`;
      }
    }
  }, [session, status]);

  useEffect(() => {
    if (userId) {
      console.log("UsuarioId: ", userId);
      // Convertir el objeto JSON a una cadena
      const userJSON = JSON.stringify(session?.user);

      // Guardar el objeto como una cadena en LocalStorage
      localStorage.setItem('user', userJSON);
    }
  }, [userId]);

  if (!isAuthenticated) {
    return <p>Redirigiendo...</p>; // Mostrar un mensaje temporal mientras redirige
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Renderiza el catálogo aquí */}
      {userId ? <CatalogoProductosSuma /> : <p>Cargando...</p>}
    </div>
  );
};

export default Page;



