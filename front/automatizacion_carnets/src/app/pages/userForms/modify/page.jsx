"use client"

import ModificarErrores from '@/app/components/forms/ModificarErrores';
import Navbar from '@/app/components/ui/Navbar'; // Importa el Navbar

export default function ModificarErroresPage() {
    return (
        <>
            <Navbar /> {/* Agrega el Navbar aquí */}
            <ModificarErrores />
        </>
    );
}