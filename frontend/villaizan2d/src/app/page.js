"use client";

import React from "react";
import Menu from "./components/menu/menu.js"; // Importar el componente de menú

export default function Home() {
  const handleClick = (message) => {
    alert(message);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", overflow: "hidden" }}>
      {/* Menú lateral */}
      <div style={{ width: "80px", backgroundColor: "#b71c1c", height: "100vh", position: "fixed", top: 0, left: 0 }}>
        <Menu />
      </div>

      {/* Contenedor principal */}
      <div style={{ marginLeft: "80px", padding: "20px", width: "100%", overflowY: "auto" }}>
        <div className="container">
          <div className="header">
            <h1>Bienvenido, Administrador!</h1>
          </div>
          <div className="grid">
            {/* Cada tarjeta tiene un evento onClick que llama a la función handleClick */}
            <div className="card" onClick={() => handleClick("Gestión de Recompensas")}>
              Gestión de Recompensas
            </div>
            <div className="card" onClick={() => handleClick("Gestión de Puntos")}>
              Gestión de Puntos
            </div>
            <div className="card" onClick={() => handleClick("Gestión de Promociones")}>
              Gestión de Promociones
            </div>
            <div className="card" onClick={() => handleClick("Gestión de Notificaciones")}>
              Gestión de Notificaciones
            </div>
            <div className="card" onClick={() => handleClick("Gestión de Multimedia")}>
              Gestión de Multimedia
            </div>
          </div>
        </div>

        {/* Estilos en línea en React */}
        <style jsx>{`
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
          }
          .header {
            background: #333;
            color: #fff;
            padding-top: 30px;
            min-height: 70px;
            border-bottom: #77aaff 3px solid;
          }
          .header h1 {
            text-align: center;
            text-transform: uppercase;
            margin: 0;
          }
          .grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin-top: 20px;
          }
          .card {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin: 10px;
            text-align: center;
            flex: 1 1 calc(33.333% - 40px);
            cursor: pointer;
            transition: transform 0.3s;
          }
          .card:hover {
            transform: scale(1.05);
          }
        `}</style>
      </div>
      
    </div>

  );
}
