"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Carnet from "@/app/components/Carnet";
import FormActualizacionCarnet from "@/app/components/forms/FormActualizacionCarnet";
import FormActualizaFoto from "@/app/components/forms/FormActualizaFoto";

export default function ModificarCarnetIndividualPage() {
    const { dni } = useParams();  // Obtener el dni desde los parámetros de la URL
    const router = useRouter();

    const [previewFoto, setPreviewFoto] = useState("");

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

    const handleChangePhoto = (newPhoto) => {
        setPreviewFoto(newPhoto);
        setCarnet((prev) => {
            const updatedCarnet = { ...prev, foto: newPhoto };
            // Actualizar en localStorage
            updatePersonInLocalStorage(updatedCarnet);
            return updatedCarnet;
        });
    };
    
    const handleChangeCarnet = (updatedCarnet) => {
        setCarnet(updatedCarnet);
        // Actualizar en localStorage
        updatePersonInLocalStorage(updatedCarnet);
    };
    // Solo realizar la carga de datos si "dni" está disponible
    useEffect(() => {

        // Aquí debemos substituirlo por una llamada a la base de datos, para obtener los datos del usuario con dni especificado
        const fetchCarnet = async () => {
            try {
                const response = await fetch(`http://localhost:3005/api/person/dni/${dni}`);
                if (!response.ok) throw new Error("Error al obtener datos del carnet");

                const data = await response.json();

                setCarnet(data);
                setPreviewFoto(data.foto);
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

    const updatePersonInLocalStorage = (updatedCarnet) => {
        // Obtener el array de personas de localStorage
        const storedPeople = localStorage.getItem("SelectedPeople");
        let selectedPeople = storedPeople ? JSON.parse(storedPeople) : [];
    
        // Encontrar la persona a actualizar por su _id
        const personIndex = selectedPeople.findIndex(person => person._id === updatedCarnet._id);
    
        if (personIndex !== -1) {
            // Actualizamos la persona con los nuevos datos
            selectedPeople[personIndex] = { ...selectedPeople[personIndex], ...updatedCarnet };
    
            // Guardamos el array actualizado nuevamente en localStorage
            localStorage.setItem("SelectedPeople", JSON.stringify(selectedPeople));
        }
    };
    
    

    return (
        <div className="flex flex-col h-[85vh]">
            <button
                className="m-4 w-fit bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => router.push('/pages/preview')}
            >
                &larr;
            </button>
            <div className="grid grid-cols-2 items-center justify-center p-4">
                <div className="flex flex-col items-center">

                    <Carnet carnet={carnet} />
                </div>
                <div className="flex flex-col gap-4">
                    <FormActualizacionCarnet carnet={carnet} setCarnet={handleChangeCarnet} />
                    <FormActualizaFoto id={carnet._id} previewFoto={previewFoto} setPreviewFoto={handleChangePhoto} />
                </div>

            </div>
        </div>
    );
}
