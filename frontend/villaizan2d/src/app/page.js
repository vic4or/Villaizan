"use client";

import React, { useState, useEffect } from "react";
import Menu from "./components/menu/menu.js"; // Importar el componente de menú

const Icon = ({ name }) => {
  const icons = {
    gift: "🎁",
    card: "💳",
    percent: "%",
    bell: "🔔",
    image: "🖼️",
    tag: "🏷️",
    apple: "🍎", // Icono para "Gestión de Frutas"
  };
  return (
    <span className="icon" style={{ fontSize: '3rem', lineHeight: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      {icons[name] || "📦"}
    </span>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular un tiempo de carga
    const timer = setTimeout(() => setLoading(false), 3000); // 3 segundos
    return () => clearTimeout(timer); // Limpiar el temporizador
  }, []);

  const handleClick = (message) => {
    alert(message);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {loading ? (
        <div className="loading-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {/* Menú lateral */}
          <div style={{ width: "80px", backgroundColor: "#b71c1c", height: "100vh", position: "fixed", top: 0, left: 0 }}>
            <Menu />
          </div>

          {/* Contenedor principal */}
          <div style={{ marginLeft: "80px", padding: "40px", width: "100%", overflowY: "auto" }}>
            <div className="container">
              <div className="header">
                <h1 style={{ textAlign: "center" }}>Bienvenido, Administrador!</h1>
              </div>
              <div className="grid">
                {/* Tarjetas de opciones */}
                <div className="card" onClick={() => window.location.href='/pages/recompensas/lista'}>  
                  <div className="icon-container">
                    <Icon name="gift" />
                  </div>
                  <h3>Gestión de Recompensas</h3>
                  <p>Administra los puntos de recompensa de los clientes</p>
                </div>
                <div className="card" onClick={() => window.location.href='/pages/puntos/lista'}>  
                  <div className="icon-container">
                    <Icon name="card" />
                  </div>
                  <h3>Gestión de Puntos</h3>
                  <p>Administra los puntos asignados por la compra de cada producto</p>
                </div>
                <div className="card" onClick={() => handleClick("Gestión de Códigos")}>  
                  <div className="icon-container">
                    <Icon name="percent" />
                  </div>
                  <h3>Gestión de Canjes</h3>
                  <p>Administra los códigos generados por los clientes para canjear recompensas</p>
                </div>
                <div className="card" onClick={() => window.location.href='/pages/notificaciones/lista'}>  
                  <div className="icon-container">
                    <Icon name="bell" />
                  </div>
                  <h3>Gestión de Notificaciones</h3>
                  <p>Gestiona el envío de notificaciones sobre promociones y la programación de las notificaciones</p>
                </div>
                <div className="card" onClick={() => window.location.href='/pages/multimedia/lista'}>  
                  <div className="icon-container">
                    <Icon name="image" />
                  </div>
                  <h3>Gestión de Multimedia</h3>
                  <p>Crea, modifica y gestiona contenido multimedia como imágenes y videos de frutas y helados</p>
                </div>
                <div className="card" onClick={() => window.location.href='/pages/promociones/lista'}>  
                  <div className="icon-container">
                    <Icon name="tag" />
                  </div>
                  <h3>Gestión de Promociones</h3>
                  <p>Administra ofertas y promociones para los clientes</p>
                </div>
                <div className="card" onClick={() => window.location.href='/pages/frutas/lista'}>
                  <div className="icon-container">
                    <Icon name="apple" />
                  </div>
                  <h3>Gestión de Frutas</h3>
                  <p>Administra la información sobre las frutas y los productos que las contienen</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        /* Pantalla de carga */
        .loading-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
          background-color: #f0f2f5;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }

        /* Loader animado */
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #b71c1c;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Otros estilos */
        .container {
          width: 100%;
          margin: auto;
          overflow: hidden;
        }
        .header {
          color: #333;
          margin-bottom: 40px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .card {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .icon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
        }
        .icon {
          font-size: 8rem;
          line-height: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        h3 {
          font-size: 1.4em;
          margin-top: 10px;
          color: #333;
        }
        p {
          font-size: 1em;
          color: #666;
        }
      `}</style>
    </div>
  );
}
