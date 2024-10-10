"use client";

import React, { useEffect, useState } from "react";
import Menu from "../../../components/menu/menu.js";
import FormularioNotificacion from "../../../components/notificaciones/formularioNotificaciones.js";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaginaNuevaNotificacion() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("editar") === "true";
  const id = searchParams.get("id");
  const [notificacionData, setNotificacionData] = useState(null);

  // Datos de notificaciones simulados para obtener la notificación a editar
  const notificaciones = [
    {
      id: 1,
      asunto: "¡Descuento Exclusivo!",
      tipo: "Oferta Especial",
      mensaje: "Estimado PlaceHolder, ¡Descuento Exclusivo! Aprovecha nuestra Oferta Especial válida hasta el 2024-10-02",
      promocion: "Paleta de fresa gratis, 2x1 en mafeletas",
      enviarPorCorreo: true,
      activo: true,
    },
    {
      id: 2,
      asunto: "Promoción de Temporada",
      tipo: "Descuentos",
      mensaje: "Estimado PlaceHolder, ¡Promoción de Temporada! Aprovecha nuestra Puntos Dobles válida hasta el 2024-10-10",
      promocion: "Mafeleta de 3 sabores al 50%, Paleta glaseada de fresa gratis",
      enviarPorCorreo: false,
      activo: false,
    },
  ];

  // Obtener los datos de la notificación si es edición
  useEffect(() => {
    if (isEditMode && id) {
      const notificacion = notificaciones.find((notif) => notif.id === parseInt(id));
      if (notificacion) {
        setNotificacionData(notificacion);
      }
    }
  }, [isEditMode, id]);

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", overflow: "hidden" }}>
      {/* Menú lateral */}
      <div style={{ width: "80px", backgroundColor: "#b71c1c", height: "100vh", position: "fixed", top: 0, left: 0 }}>
        <Menu />
      </div>
      
      {/* Contenedor principal */}
      <div style={{ marginLeft: "80px", padding: "20px", width: "100%", overflowY: "auto" }}>
        <FormularioNotificacion isEditMode={isEditMode} initialValues={notificacionData || {}} />
      </div>
    </div>
  );
}