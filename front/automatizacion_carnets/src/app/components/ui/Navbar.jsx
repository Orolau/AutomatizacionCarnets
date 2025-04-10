"use client";

import Link from "next/link";
import "@/app/styles/Navbar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="p-4 border-b">
        {/* Botón para cerrar el sidebar */}
        <button onClick={toggleSidebar} className="close-btn">
          ✖
        </button>
      </div>
      <ul className="p-4 space-y-4">
        {/* Enlace a la página de Inicio */}
        <li>
          <Link href="/pages/userForms/login">
            <span onClick={toggleSidebar}>Log IN</span>
          </Link>
        </li>
        {/* Enlace a la página de Verificación */}
        <li>
          <Link href="/pages/verify">
            <span onClick={toggleSidebar}>Verificación</span>
          </Link>
        </li>
        {/* Enlace a la página de Filtrado */}
        <li>
          <Link href="/pages/listaFiltrado">
            <span onClick={toggleSidebar}>Filtrado</span>
          </Link>
        </li>
        {/* Enlace a la página de Preview Carnets */}
        <li>
          <Link href="/pages/preview">
            <span onClick={toggleSidebar}>Preview Carnets</span>
          </Link>
        </li>
        {/* Enlace a la página de Download Carnets */}
        <li>
          <Link href="/pages/download">
            <span onClick={toggleSidebar}>Descarga Carnets</span>
          </Link>
        </li>
        {/* Enlace a la página de Modificar Carnets */}
        <li>
          <Link href="/pages/modify">
            <span onClick={toggleSidebar}>Modificar Carnets</span>
          </Link>
        </li>
        {/* Enlace a la página de Pendientes */}
        <li>
          <Link href="/pages/pending">
            <span onClick={toggleSidebar}>Pendientes</span>
          </Link>
        </li>
        {/* Enlace a la página de EtiquetasEnvio */}
        <li>
          <Link href="/pages/etiqueta">
            <span onClick={toggleSidebar}>Etiquetas</span>
          </Link>
        </li>
        {/* Enlace a la página de Estado de Carnets */}
        <li>
          <Link href="/pages/EstadoCarnet">
            <span onClick={toggleSidebar}>Estado de Carnets</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
