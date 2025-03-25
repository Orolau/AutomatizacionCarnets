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
            {/* Contenedor principal */}
            <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg max-w-[1200px] mx-auto overflow-hidden p-6 gap-6">

                {/* CARNET + botón volver */}
                <div className="flex flex-col gap-4 justify-start items-start w-full lg:w-1/2 relative">
                    {/* Botón volver dentro del bloque del carnet */}
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0065ef] text-white hover:bg-[#005dd7] transition absolute top-0 left-0 z-10"
                        onClick={() => router.push('/pages/preview')}
                        aria-label="Volver"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Carnet centrado */}
                    <div className="w-full pt-12 flex justify-center">
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
    );
}
