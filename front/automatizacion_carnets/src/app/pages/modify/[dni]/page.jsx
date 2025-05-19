"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Carnet from "@/app/components/Carnet";
import FormActualizacionCarnet from "@/app/components/forms/FormActualizacionCarnet";
import FormActualizaFoto from "@/app/components/forms/FormActualizaFoto";
import { fetchPersonByDni } from "@/app/api/api";

export default function ModificarCarnetIndividualPage() {
    const searchParams = useSearchParams();
    const dni = searchParams.get("dni");
    const router = useRouter();

    const [previewFoto, setPreviewFoto] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [carnet, setCarnet] = useState({
        dni: "",
        tipoUsuario: "",
        tipoTitulacion: "",
        titulacion: "",
        cargo: "",
        departamento: "",
        foto: "",
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
                const data = await fetchPersonByDni(dni);
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
        const storedPeople = localStorage.getItem("selectedPeople");
        let selectedPeople = storedPeople ? JSON.parse(storedPeople) : [];

        // Filtrar para eliminar el registro con el _id de updatedCarnet
        selectedPeople = selectedPeople.filter(person => person._id !== updatedCarnet._id);

        // Agregar el registro actualizado
        selectedPeople.push(updatedCarnet);

        // Eliminar el registro antiguo de localStorage
        localStorage.removeItem("selectedPeople");

        // Guardar el array actualizado en localStorage
        localStorage.setItem("selectedPeople", JSON.stringify(selectedPeople));

        setShowModal(true);
    };




    return (
        <div className="min-h-screen bg-[#f0f6ff] px-4 py-6 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg max-w-[1200px] w-full overflow-hidden">

                {/* Barra azul superior con botones */}
                <div className="w-full bg-blue-100 p-3 flex items-center justify-between">

                    {/* Botón volver */}
                    <button onClick={() => router.push('/pages/finales/principal')} aria-label="Volver">
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

                        <FormActualizacionCarnet carnet={carnet} setCarnet={setCarnet} updatePersonInLocalStorage={updatePersonInLocalStorage} />
                        {/* Botón guardar */}
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => document.querySelector("form")?.requestSubmit()}
                                className="bg-[#0065ef] hover:bg-[#005dd7] text-white px-8 py-3 rounded-full text-lg font-semibold transition"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                        <hr className="my-2 border-gray-300" />

                        <FormActualizaFoto
                            id={carnet._id}
                            previewFoto={previewFoto}
                            setPreviewFoto={handleChangePhoto}
                        />


                    </div>

                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-xl text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-xl font-bold text-gray-600">Cambios guardados con éxito</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-lg"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
