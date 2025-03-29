"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Carnet from "@/app/components/Carnet";
import FormActualizacionCarnet from "@/app/components/forms/FormActualizacionCarnet";
import FormActualizaFoto from "@/app/components/forms/FormActualizaFoto";

export default function ModificarCarnetIndividualPage() {
    const { dni } = useParams();
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
        apellidos: "",
        _id: ""
    });

    const handleChangePhoto = (newPhoto) => {
        setPreviewFoto(newPhoto);
        setCarnet(prev => ({ ...prev, foto: newPhoto }));
    };

    useEffect(() => {
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

    if (!dni) return <div className="p-8 text-center">Cargando...</div>;

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
        <div className="min-h-screen bg-[#f0f6ff] px-4 py-6 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg max-w-[1200px] w-full overflow-hidden">

                {/* Barra azul superior con botones */}
                <div className="w-full bg-blue-100 p-3 flex items-center justify-between">
                    
                    {/* Botón volver */}
                    <button onClick={() => router.push('/pages/preview')} aria-label="Volver">
                        <Image
                            src="/images/arrow-back-outline.png"
                            alt="Volver"
                            width={25}
                            height={25}
                        />
                    </button>

                    {/* Contenedor de los botones de navegación */}
                    <div className="flex gap-4">
                        {/* Botón atrás */}
                        <button onClick={() => console.log("Atrás")} aria-label="Atrás">
                            <Image
                                src="/images/izquierda.png" 
                                alt="Atrás"
                                width={20}
                                height={20}
                            />
                        </button>

                        {/* Botón adelante */}
                        <button onClick={() => console.log("Adelante")} aria-label="Adelante">
                            <Image
                                src="/images/derecha.png"
                                alt="Adelante"
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>
                </div>

                {/* Contenedor principal de carnet y formulario */}
                <div className="flex flex-col lg:flex-row p-6 gap-6">
                    
                    {/* Bloque del carnet */}
                    <div className="flex flex-col w-full lg:w-1/2">
                        <div className="w-full flex justify-center">
                            <div className="max-w-sm">
                                <Carnet carnet={carnet} />
                            </div>
                        </div>
                    </div>

                    {/* Formulario y foto */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6 bg-[#e6f0fd] p-6 rounded-xl">
                        <h2 className="text-2xl font-bold text-center text-[#0d1b2a]">Modificar datos</h2>

                        <FormActualizacionCarnet carnet={carnet} setCarnet={setCarnet} />

                        <hr className="my-2 border-gray-300" />

                        <FormActualizaFoto
                            id={carnet._id}
                            previewFoto={previewFoto}
                            setPreviewFoto={handleChangePhoto}
                        />

                        {/* Botón guardar */}
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => document.querySelector("form")?.requestSubmit()}
                                className="bg-[#0065ef] hover:bg-[#005dd7] text-white px-8 py-3 rounded-full text-lg font-semibold transition"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
