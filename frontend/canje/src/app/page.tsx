/* eslint-disable */
"use client";

import React,{useState,useRef,useEffect} from "react";
import { useSession } from "next-auth/react";
import CatalogoProductosSuma from "@/app/catalogo/page"; // Asegúrate de que la ruta sea correcta

const Page: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: session, status } = useSession();
  const hasRunOnceAuth = useRef(false);
  const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
    if(status !== "loading" && !hasRunOnceAuth.current) {
      hasRunOnceAuth.current = true;
      //@ts-ignore
      if (session?.user?.db_info.id) {
        console.log("Is isAuthenticated",isAuthenticated)
        setIsAuthenticated(true);
        //@ts-ignore
        setUserId(session.user.db_info.id);
        console.log("UserId",userId)
      } else {
        console.log("Not isAuthenticated")
        setIsAuthenticated(false);
        setUserId(null);
      }
    }
  }, [session, status]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Renderiza el catálogo aquí */}
      
      <CatalogoProductosSuma />
    </div>
  );
};

export default Page;

