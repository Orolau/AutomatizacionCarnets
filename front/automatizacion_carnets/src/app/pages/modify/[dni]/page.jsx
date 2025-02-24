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
        foto: "/images/images.png",
        nombre: "",
        _id: ""
    });

    // Solo realizar la carga de datos si "dni" está disponible
    useEffect(() => {

        // Aquí debemos substituirlo por una llamada a la base de datos, para obtener los datos del usuario con dni especificado
        const fetchCarnet = async () => {
            try {
                const response = await fetch(`http://localhost:3005/api/person/dni/${dni}`);
                if (!response.ok) throw new Error("Error al obtener datos del carnet");
                
                const data = await response.json();
                console.log(data)
                setCarnet(data);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };
    
        if (dni) {
            fetchCarnet();
        }
    }, [dni]);

    // Si "dni" no está disponible, mostrar un mensaje de carga o vacío
    if (!dni) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid grid-cols-2 items-center justify-center p-4">
            <div className="flex flex-col align-top">
            <button 
                className="m-4 w-fit bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => router.push('/pages/preview')}
            >
                &larr;
            </button>
            <Carnet carnet={carnet} />
            </div>
            
            <FormActualizacionCarnet carnet={carnet} setCarnet={setCarnet} />
            
        </div>
    );
}
