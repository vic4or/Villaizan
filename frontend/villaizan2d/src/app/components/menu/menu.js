import React from 'react';
import { FaHome, FaGift, FaTags, FaBell, FaSignOutAlt, FaClipboardList, FaCreditCard } from 'react-icons/fa';
import { BsImage } from 'react-icons/bs';
import { BiSolidDiscount } from "react-icons/bi";
import { TbLetterV } from "react-icons/tb";
import Link from 'next/link'; // Importar Link de Next.js

export default function Menu() {
  return (
    <div style={{
      height: "100vh",
      width: "80px",
      background: "linear-gradient(to bottom, #e63946, #b2182b)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 0"
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "20px" }}>
      <Link href="/">
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          padding: "10px",
          marginBottom: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
        }}>
          <TbLetterV size="24px" style={{ color: "#e63946" }} /> 
        </div>
      </Link>
      </div>

      {/* Menú de iconos */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center",
      }}>
        {/* Home */}
        <Link href="/">
          <div style={menuItemStyle} title="Inicio">
            <FaHome size="20px" style={{ color: "#000" }} />
          </div>
        </Link>

        {/* Multimedia */}
        <Link href="/pages/multimedia/lista">
          <div style={menuItemStyle} title="Multimedia">
            <BsImage size="20px" style={{ color: "#000" }} />
          </div>
        </Link>

        {/* Notificaciones */}
        <div style={menuItemStyle} title="Notificaciones">
          <FaBell size="20px" style={{ color: "#000" }} />
        </div>

        {/* Promociones */}
        <Link href="/pages/promociones/lista">
          <div style={menuItemStyle} title="Promociones">
            <BiSolidDiscount size="20px" style={{ color: "#000" }} />
          </div>
        </Link>

        {/* Puntos */}
        <Link href="/pages/puntos/lista">
          <div style={menuItemStyle} title="Puntos">
            <FaCreditCard size="20px" style={{ color: "#000" }} />
          </div>
        </Link>

        {/* Recompensas */}
        <div style={menuItemStyle} title="Recompensas">
          <FaGift size="20px" style={{ color: "#000" }} />
        </div>
      </div>

      {/* Cerrar sesión */}
      <div style={menuItemStyle} title="Cerrar Sesión">
        <FaSignOutAlt size="20px" style={{ color: "#000" }} />
      </div>
    </div>
  );
}

const menuItemStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "10px",
  cursor: "pointer",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};
