"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

    return (
        <div className="min-h-screen bg-[#f0f6ff] px-4 py-6">
            {/* Botón volver */}
            <button
                className="mb-4 bg-[#0065ef] text-white px-4 py-2 rounded hover:bg-[#005dd7]"
                onClick={() => router.push('/pages/preview')}
            >
                &larr; Volver
            </button>

            {/* Contenedor principal */}
            <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg max-w-[1200px] mx-auto overflow-hidden p-6 gap-6">
                {/* Carnet */}
                <div className="flex justify-center items-center w-full lg:w-1/2">
                    <div className="max-w-sm">
                        <Carnet carnet={carnet} />
                    </div>
                </div>

                {/* Formulario */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6 bg-[#e6f0fd] p-6 rounded-xl">
                    <h2 className="text-2xl font-bold text-center text-[#0d1b2a]">Modificar datos</h2>

                    {/* Formulario principal */}
                    <FormActualizacionCarnet carnet={carnet} setCarnet={setCarnet} />

                    {/* Separador visual */}
                    <hr className="my-2 border-gray-300" />

                    {/* Subida de imagen */}
                    <FormActualizaFoto
                        id={carnet._id}
                        previewFoto={previewFoto}
                        setPreviewFoto={handleChangePhoto}
                    />

                    {/* Botón final */}
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
    );
}
