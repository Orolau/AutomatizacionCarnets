"use client";

import { useState } from "react";

export default function FormActualizaFoto({ previewFoto, id, setPreviewFoto, updatePersonInLocalStorage }) {
    const [fileToUpload, setFileToUpload] = useState(null);

    const handleSubmit = async () => {
        if (!fileToUpload) return;

        const formData = new FormData();
        formData.append("foto", fileToUpload);

        try {
            const response = await fetch(`http://localhost:3005/api/person/updatePhoto/${id}`, {
                method: "PUT",
                body: formData
            });

            if (!response.ok) throw new Error("Error al actualizar la foto");

            const data = await response.json();
            const nuevaFoto = data.updatedPerson.foto;

            // Actualiza la vista previa
            setPreviewFoto(nuevaFoto);

            // Actualiza la foto en localStorage
            const storedPeople = JSON.parse(localStorage.getItem("selectedPeople")) || [];
            const updatedPeople = storedPeople.map(person => 
                person._id === id ? { ...person, foto: nuevaFoto } : person
            );

            localStorage.setItem("selectedPeople", JSON.stringify(updatedPeople));

            // Llama a la función de actualización externa si existe
            if (updatePersonInLocalStorage) {
                updatePersonInLocalStorage({ _id: id, foto: nuevaFoto });
            }
        } catch (error) {
            console.error("Error en handleSubmit:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-700">Foto de Carnet:</label>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-24 h-24 border border-gray-300 rounded-lg flex items-center justify-center bg-white text-4xl text-gray-400">
                    {previewFoto ? (
                        <img
                            src={previewFoto}
                            alt="Vista previa"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        "👤"
                    )}
                </div>

                <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-[#f2f2f2] px-6 py-5 text-center cursor-pointer hover:border-[#005dd7] transition">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                                setFileToUpload(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setPreviewFoto(reader.result);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center text-sm text-gray-500">
                        <span className="text-xl mb-1">🖼️</span>
                        <span>Arrastra una imagen o</span>
                        <span className="text-[#0065ef] underline">sube un archivo</span>
                    </div>
                </label>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-[#0065ef] hover:bg-[#005dd7] text-white px-5 py-2 rounded-full transition"
                >
                    Cambiar Foto
                </button>
            </div>
        </div>
    );
}
