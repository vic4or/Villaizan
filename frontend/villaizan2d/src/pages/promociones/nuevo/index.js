"use client";

import React, { useEffect, useState } from "react";
import Menu from "../../../app/components/menu/menu.js";
import FormularioPromocion from "../../../app/components/promociones/formularioPromocion.js";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaginaNuevaPromocion() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("editar") === "true";
  const id = searchParams.get("id");
  const [promocionData, setPromocionData] = useState(null);

  // Datos de promociones simulados para obtener la promoción a editar
  const promociones = [
    {
      id: 1,
      nombre: "Helado gratis",
      tipo: "Oferta Especial",
      descripcion: "Obtén un 100% de descuento en un helado por día de fundación de helados Villizan",
      fechaInicio: "27/09/24",
      fechaFin: "27/10/24",
      descuento: "100%",
      productos: ["Paleta - Fresa", "Paleta - Aguaje"],
      limiteStock: "100"
    },
    {
      id: 2,
      nombre: "50% de Descuento",
      tipo: "Paquete",
      descripcion: "Obtén un 30% de descuento en total por llevarte este paquete",
      fechaInicio: "28/09/24",
      fechaFin: "28/10/24",
      descuento: "30%",
      productos: ["Mafeleta - Ron", "Mafeleta - Coco"],
      limiteStock: "200"
    }
  ];

  // Obtener los datos de la promoción si es edición
  useEffect(() => {
    if (isEditMode && id) {
      const promocion = promociones.find((promo) => promo.id === parseInt(id));
      if (promocion) {
        setPromocionData(promocion);
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
        <FormularioPromocion isEditMode={isEditMode} initialValues={promocionData || {}} />
      </div>
    </div>
  );
}
