"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NuevaMultimedia from "../../../components/multimedia/nuevaMultimedia.js";
import Menu from "../../../components/menu/menu.js";

export default function PaginaEditarMultimedia() {
  const initialData = {
    1: { 
      fruit: "Manzana", 
      description: "Introducción a la manzana y sus beneficios", 
      type: "Video", 
      message: "Mensaje educativo de la manzana", 
      videoURL: "https://vid.com/manzana" 
    },
    3: { 
      fruit: "Naranja", 
      description: "Video educativo sobre las naranjas", 
      type: "Video", 
      message: "Mensaje educativo sobre las naranjas", 
      videoURL: "https://vid.com/naranja" 
    },
    4: { 
      fruit: "Manzana verde", 
      description: "La manzana verde en la cocina", 
      type: "Información", 
      message: "Las manzanas son una de las frutas más populares y saludables del mundo." 
    }
  };

  const searchParams = useSearchParams();
  const id = searchParams.get("id"); 

  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    if (id && initialData[id]) {
      setInitialValues(initialData[id]);
    }
  }, [id, initialData]); 
  

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "80px", backgroundColor: "#b71c1c", height: "100vh", position: "fixed", top: 0, left: 0 }}>
        <Menu />
      </div>
      <div style={{ marginLeft: "80px", padding: "20px", width: "100%", overflowY: "auto" }}>
        <NuevaMultimedia isEditMode={true} initialValues={initialValues} />
      </div>
    </div>
  );
}
