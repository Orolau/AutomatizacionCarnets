"use client";

import { useState } from "react";
import Link from "next/link";
import "@/app/styles/Navbar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón para abrir o cerrar el sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-blue-600 text-white rounded-md hover:bg-gray-600"
      >
        ☰
      </button>

      {/* Contenedor del sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="p-4 border-b">
          {/* Botón para cerrar el sidebar */}
          <button
            onClick={() => setIsOpen(false)}
            className="close-btn"
          >
            ✖ Cerrar
          </button>
        </div>
        <ul className="p-4 space-y-4">
          {/* Enlace a la página de Inicio */}
          <li>
            <Link href="/pages/userForms/login">
              <span onClick={() => setIsOpen(false)}>Inicio</span>
            </Link>
          </li>
          {/* Enlace a la página de Verificación */}
          <li>
            <Link href="/pages/userForms/verify">
              <span onClick={() => setIsOpen(false)}>Verificación</span>
            </Link>
          </li>
          {/* Enlace a la página de Filtrado */}
          <li>
            <Link href="/pages/userForms/filter">
              <span onClick={() => setIsOpen(false)}>Filtrado</span>
            </Link>
          </li>
          {/* Enlace a la página de Modificar Carnets */}
          <li>
            <Link href="/pages/userForms/modify">
              <span onClick={() => setIsOpen(false)}>Modificar Carnets</span>
            </Link>
          </li>
          {/* Enlace a la página de Preview Carnets */}
          <li>
            <Link href="/pages/userForms/preview">
              <span onClick={() => setIsOpen(false)}>Preview Carnets</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
