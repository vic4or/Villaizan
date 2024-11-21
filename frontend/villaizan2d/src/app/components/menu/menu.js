import React from 'react';
import { FaHome, FaGift, FaTags, FaBell, FaSignOutAlt, FaClipboardList, FaCreditCard, FaAppleAlt } from 'react-icons/fa';
import { BsImage } from 'react-icons/bs';
import { BiSolidDiscount } from "react-icons/bi";
import { TbLetterV } from "react-icons/tb";
import { CiBarcode } from "react-icons/ci";
import Link from 'next/link';

export default function Menu() {
  return (
    <div
      style={{
        position: "fixed",
        height: "100vh",
        width: "80px", 
        background: "linear-gradient(to bottom, #e63946, #b2182b)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 0",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        zIndex: "10000"
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
  borderRadius: "50%", 
  padding: "16px", 
  cursor: "pointer",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "50px",
  height: "50px", 
};
