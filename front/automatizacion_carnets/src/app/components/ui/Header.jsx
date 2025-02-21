"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function Header() {
    const pathname = usePathname(); // Obtenemos el pathname actual

    // Mapeo de rutas para mostrar nombres legibles
    const stepMapping = {
        '/filter': 'Filtrado/Búsqueda de Carnet',
        '/login': 'Login',
        '/register': 'Registro',
        '/listaFiltrado': 'Lista de Filtrado',
        '/verify': 'Verificación',
        '/modify': 'Modificación de Carnet',
        '/preview': 'Vista Previa',
        '/logs': 'Logs',
        '/pending': 'Carnets Pendientes/Errores',
    };

    // Obtener los segmentos de la ruta
    const pathSegments = pathname.split('/').filter((segment) => segment);

    // Filtrar y mapear los segmentos a nombres legibles solo si están en stepMapping
    const breadcrumb = useMemo(() => {
        return pathSegments
            .map((segment) => stepMapping[`/${segment}`]) // Intentamos mapear cada segmento a su nombre legible
            .filter(Boolean); // Filtramos los valores que no están en stepMapping (undefined o null)
    }, [pathname]);

    return (
        <div className="bg-blue-600 px-6 py-4 shadow-md">
            <div className="flex justify-between items-center mx-20 gap-6">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/myAccount">
                        <Image
                            src="/images/logoU-tad.png"  // Aquí se usa la imagen proporcionada
                            alt="Logo"
                            width={60}
                            height={60}
                        />
                    </Link>
                </div>

                {/* Barra de ruta */}
                <div className="text-white text-lg">
                    {breadcrumb.length > 0 && (
                        <ul className="flex space-x-2">
                            {breadcrumb.map((segment, index) => (
                                <li key={index} className="flex items-center">
                                    {/* Si no es el último elemento, mostramos el separador ">" */}
                                    <span>{segment}</span>
                                    {index < breadcrumb.length - 1 && <span className="mx-2">{" > "}</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Icono de perfil a la derecha */}
                <div className="flex items-center cursor-pointer">
                    <img
                        src="/images/profile-icon.png" // Reemplaza con tu icono de perfil
                        alt="Perfil"
                        className="w-8 h-8 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}
