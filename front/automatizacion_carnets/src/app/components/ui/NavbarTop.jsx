import React from "react";
import Link from "next/link"; // Importamos Link de Next.js

export default function NavbarTop({ setEstado }) {
  return (
    <nav className="bg-blue-200 p-4 flex justify-between items-center">
      {/* Logo de la universidad a la izquierda */}
      <img src="/images/Logo-U-tad 1.png" alt="U-Tad Logo" width={125} height={75} />

      {/* Contenedor de los botones centrados */}
      <div className="flex space-x-6">
        <Link href="/pages/finales/principal">
          <button className="flex items-center px-4 py-2 bg-transparent hover:text-blue-800">
            <img src="/images/principal.png" alt="Icono Principal" className="w-6 h-6 mr-2" />
            Principal
          </button>
        </Link>

        <Link href="/pages/finales/pendientes">
          <button className="flex items-center px-4 py-2 bg-transparent hover:text-blue-800">
            <img src="/images/carnets_pendientes.png" alt="Icono Carnets Pendientes" className="w-6 h-6 mr-2" />
            Carnets Pendientes
          </button>
        </Link>

        <Link href="/pages/finales/etiquetas">
          <button className="flex items-center px-4 py-2 bg-transparent hover:text-blue-800">
            <img src="/images/etiquetas_envio.png" alt="Icono Etiquetas" className="w-6 h-6 mr-2" />
            Etiquetas de Envío
          </button>
        </Link>
      </div>

      {/* Contenedor de la imagen de tres puntitos y perfil a la derecha */}
      <div className="flex items-center space-x-2">
        {/* Imagen de tres puntitos */}
        <img src="/images/tres_puntitos.png" alt="Tres Puntitos" className="w-6 h-6 cursor-pointer" />

        {/* Imagen de perfil a la derecha */}
        <img src="/images/perfil2.png" alt="Perfil" className="w-10 h-10 rounded-full" />
      </div>
    </nav>
  );
}
