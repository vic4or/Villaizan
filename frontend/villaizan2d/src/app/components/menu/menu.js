import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaGift, FaTags, FaBell, FaSignOutAlt, FaClipboardList, FaCreditCard, FaAppleAlt } from 'react-icons/fa';
import { BsImage } from 'react-icons/bs';
import { BiSolidDiscount } from "react-icons/bi";
import { TbLetterV } from "react-icons/tb";
import { CiBarcode } from "react-icons/ci";
import Link from 'next/link';

export default function Menu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      onClick={toggleMenu}
      style={{
        height: "100vh",
        width: isExpanded ? "260px" : "80px",
        background: "linear-gradient(to bottom, #e63946, #b2182b)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 0",
        cursor: "pointer",
        transition: "width 0.3s ease", // Animación suave al expandir/contraer
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
      }}
    >
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
        gap: "20px",
        alignItems: isExpanded ? "flex-start" : "center",
        width: "100%",
        paddingLeft: isExpanded ? "20px" : "0"
      }}>
        {/*         
        <Link href="/">
          <div style={menuItemStyle} title="Inicio">
            <FaHome size="24px" style={{ color: "#000" }} />
            {isExpanded && <span style={textStyle}>Inicio</span>}
          </div>
        </Link> 
        */}

        {/* Recompensas */}
        <Link href="/pages/recompensas/lista">
          <div style={menuItemStyle} title="Recompensas">
            <FaGift size="24px" style={{ color: "#000" }} />
            {isExpanded && <span style={textStyle}>Recompensas</span>}
          </div>
        </Link>

        {/* Puntos */}
        <Link href="/pages/puntos/lista">
          <div style={menuItemStyle} title="Puntos">
            <FaCreditCard size="24px" style={{ color: "#000" }} />
            {isExpanded && <span style={textStyle}>Puntos</span>}
          </div>
        </Link>

        {/* Canje */}
        <Link href="/pages/canje/lista">
          <div style={menuItemStyle} title="Canje">
            <CiBarcode size="24px" style={{ color: "#000" }} />
            {isExpanded && <span style={textStyle}>Canje de Códigos</span>}
          </div>
        </Link>

        {/* Notificaciones */}
        <Link href="/pages/notificaciones/lista">
          <div style={menuItemStyle} title="Notificaciones">
            <FaBell size="24px" style={{ color: "#000" }} />
            {isExpanded && <span style={textStyle}>Notificaciones</span>}
          </div>
        </Link>

        {/* Multimedia */}
        <Link href="/pages/multimedia/lista">
          <div style={menuItemStyle} title="Multimedia">
            <BsImage size="24px" style={{ color: "#000" }} />
            {isExpanded && <span style={textStyle}>Multimedia</span>}
          </div>
        </Link>

        {/* Promociones */}
        <Link href="/pages/promociones/lista">
          <div style={menuItemStyle} title="Promociones">
            <BiSolidDiscount size="24px" style={{ color: "#000" }} />
            {isExpanded && <span style={textStyle}>Promociones</span>}
          </div>
        </Link>

        {/* Frutas */}
        <Link href="/pages/frutas/lista">
          <div style={menuItemStyle} title="Frutas">
            <FaAppleAlt size="24px" style={{ color: "#000" }} />
            {isExpanded && <span style={textStyle}>Frutas</span>}
          </div>
        </Link>
      </div>

      {/* Cerrar sesión */}
      <Link href="/">
        <div style={menuItemStyle} title="Cerrar Sesión">
          <FaSignOutAlt size="24px" style={{ color: "#000" }} />
        </div>
      </Link>
    </div>
  );
}

const menuItemStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "12px",
  cursor: "pointer",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  width: "100%",
  transition: "background 0.3s ease, padding 0.3s ease",
};

const textStyle = {
  color: "#000",
  fontSize: "18px",
  fontWeight: "500",
};
