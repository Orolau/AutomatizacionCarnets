"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Carnet from "@/app/components/Carnet";
import FormActualizacionCarnet from "@/app/components/forms/FormActualizacionCarnet";

export default function ModificarCarnetIndividualPage() {
    const { dni } = useParams();  // Obtener el dni desde los parámetros de la URL
    const router = useRouter();
    
    const [carnet, setCarnet] = useState({
        dni: "",
        tipoUsuario: "",
        tipoTitulacion: "",
        titulacion: "",
        cargo: "",
        departamento: "",
        foto: "/images/default-photo.jpg",
        nombre: "",
    });

    // Solo realizar la carga de datos si "dni" está disponible
    useEffect(() => {

        // Aquí debemos substituirlo por una llamada a la base de datos, para obtener los datos del usuario con dni especificado
        const fetchedCarnet = {
            dni: dni,
            nombre: "Juan Pérez",
            tipoUsuario: "alumno",
            foto: "/images/juan-perez.jpg", 
            titulacion: "Ingeniería Informática",
            tipoTitulacion: "Grado",
            cargo: "",
            departamento: "",
        };

        // Actualizamos el estado con los datos del carnet
        setCarnet(fetchedCarnet);
    }, [dni]);

    // Si "dni" no está disponible, mostrar un mensaje de carga o vacío
    if (!dni) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
        <div className="grid grid-cols-2 items-center justify-center p-4">
            <Carnet carnet={carnet} />
            <FormActualizacionCarnet carnet={carnet} setCarnet={setCarnet} />
            
        </div>
        <button 
                className="m-4 w-11/12 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => router.push('/pages/preview')}
            >
                Siguiente
            </button>
        </div>
    );
}
