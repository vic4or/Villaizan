"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Importa useSearchParams desde next/navigation
import NuevaMultimedia from "../nuevaMultimedia.js";
import Menu from "../../menu/menu";

export default function PaginaEditarMultimedia() {
  // Simulación de datos iniciales
  const initialData = {
    1: { fruit: "Manzana", description: "Introducción a la manzana y sus beneficios", type: "Video", message: "Mensaje educativo de la manzana", videoURL: "https://vid.com/manzana" },
    2: { fruit: "Plátano", description: "Información nutricional del plátano", type: "Información", message: "Mensaje sobre el plátano" },
    3: { fruit: "Naranja", description: "Video educativo sobre las naranjas", type: "Video", message: "Mensaje educativo sobre las naranjas", videoURL: "https://vid.com/naranja" },
  };

  // Usar useSearchParams para obtener el parámetro id
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Obtener el id de la URL

  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    if (id && initialData[id]) {
      setInitialValues(initialData[id]);
    }
  }, [id]); // Agregar id como dependencia de useEffect


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
