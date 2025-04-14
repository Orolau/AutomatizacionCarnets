"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarTop() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const [correoVisible, setCorreoVisible] = useState(false);
  const [correo, setCorreo] = useState("");

  const handlePerfilClick = async () => {
    if (correoVisible) {
      setCorreoVisible(false);
      return;
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      alert("No hay sesión activa.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3005/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setCorreo(data.data[0].mail);
        setCorreoVisible(true);
      }
    } catch (error) {
      console.error("Error al obtener el correo:", error);
    }
  };

  return (
    <nav className="bg-blue-200 p-4 flex justify-between items-center">
      {/* Logo U-tad */}
      <img src="/images/Logo-U-tad 1.png" alt="U-Tad Logo" width={125} height={75} />

      {/* Navegación central */}
      <div className="flex space-x-6">
        <Link href="/pages/finales/principal">
          <button className={`flex items-center px-4 py-2 hover:text-blue-800 ${isActive("/pages/finales/principal") ? "text-blue-800 font-semibold underline" : ""}`}>
            <img src="/images/principal.png" alt="Principal" className="w-6 h-6 mr-2" />
            Principal
          </button>
        </Link>

        <Link href="/pages/finales/pendientes">
          <button className={`flex items-center px-4 py-2 hover:text-blue-800 ${isActive("/pages/finales/pendientes") ? "text-blue-800 font-semibold underline" : ""}`}>
            <img src="/images/carnets_pendientes.png" alt="Pendientes" className="w-6 h-6 mr-2" />
            Pendientes/Error
          </button>
        </Link>

        <Link href="/pages/finales/etiquetas">
          <button className={`flex items-center px-4 py-2 hover:text-blue-800 ${isActive("/pages/finales/etiquetas") ? "text-blue-800 font-semibold underline" : ""}`}>
            <img src="/images/etiquetas_envio.png" alt="Etiquetas" className="w-6 h-6 mr-2" />
            Etiquetas de Envío
          </button>
        </Link>

        <Link href="/pages/finales/excel">
          <button className={`flex items-center px-4 py-2 hover:text-blue-800 ${isActive("/pages/finales/excel") ? "text-blue-800 font-semibold underline" : ""}`}>
            <img src="/images/pagExcel.png" alt="Excel" className="w-6 h-6 mr-2" />
            Subir Excel
          </button>
        </Link>
      </div>

      {/* Parte derecha */}
      <div className="flex items-center space-x-2 relative">
        <img
          src="/images/perfil2.png"
          alt="Perfil"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={handlePerfilClick}
        />
        {correoVisible && (
          <div className="absolute top-full right-0 mt-1 bg-white text-sm text-gray-800 border border-gray-300 rounded px-3 py-1 shadow-md whitespace-nowrap z-10">
            {correo}
          </div>
        )}
      </div>
    </nav>
  );
}
