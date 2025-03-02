"use client";

import EtiquetaEnvio from "@/app/components/forms/EtiquetaEnvio";
import PendingCardsList from "@/app/components/forms/EtiquetaEnvio";
import Navbar from '@/app/components/ui/Navbar'; // Importa el Navbar

export default function EtiquetaEnvioPage() {
  return (
    <>
        <Navbar /> {/* Agrega el Navbar aquí */}
        <EtiquetaEnvio />
    </>
      
  );
}
