"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NuevaFruta from "../../../app/components/frutas/formularioFruta.js";
import Menu from "../../../app/components/menu/menu.js";

export default function EditarFrutaPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
  
    return (
      <div style={{ display: "flex", flexDirection: "row", height: "100vh", overflow: "hidden" }}>
        <div style={{ width: "80px", backgroundColor: "#b71c1c", height: "100vh", position: "fixed", top: 0, left: 0 }}>
          <Menu />
        </div>
        <div style={{ marginLeft: "80px", padding: "20px", width: "100%", overflowY: "auto" }}>
          <NuevaFruta isEditMode={true} frutaId={id} />
        </div>
      </div>
    );
  }