"use client";

import EstadoCarnet from "@/app/components/forms/EstadoCarnet.jsx";
import Navbar from '@/app/components/ui/Navbar'; // Importa el Navbar

export default function EstadoCarnetPage() {
    return (
        <>
                <Navbar /> {/* Agrega el Navbar aquí */}
                <EstadoCarnet />
        </>
    );
}
