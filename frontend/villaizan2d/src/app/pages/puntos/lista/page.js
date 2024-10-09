"use client"; 

import React from "react";
import Menu from '../../../components/menu/menu.js';
import ListaPuntos from "../../../components/puntos/listadoPuntos.js";

export default function PaginaListaPuntos() {
  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "80px", backgroundColor: "#b71c1c", height: "100vh", position: "fixed", top: 0, left: 0 }}>
        <Menu />
      </div>
      <div style={{ marginLeft: "80px", padding: "20px", width: "100%", overflowY: "auto" }}>
        <ListaPuntos />
      </div>
    </div>
  );
}