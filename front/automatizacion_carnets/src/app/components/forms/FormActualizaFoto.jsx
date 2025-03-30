"use client"

import { useState } from "react";

export default function FormActualizaFoto({ previewFoto, id, setPreviewFoto }) {
    const [fileToUpload, setFileToUpload] = useState(null);

    const handleSubmit = async () => {
        if (!fileToUpload) return;

        const formData = new FormData();
        formData.append("foto", fileToUpload);

        try {
            const response = await fetch(`http://localhost:3005/api/person/updatePhoto/${id}`, {
                method: "PUT",
                body: formData,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la foto");
            }

            const data = await response.json();
            setPreviewFoto(data.updatedPerson.foto);
            console.log("Foto actualizada correctamente");
        } catch (error) {
            console.error("Error en handleSubmit:", error);
        }
    };

    return (
        <div className="bg-blue-100 p-4 shadow-md rounded text-black flex flex-col md:flex-row items-center md:items-start gap-4">
            {/* Vista previa de la imagen a la izquierda */}
            {previewFoto && (
                <div className="flex-shrink-0">
                    <img src={previewFoto} alt="Vista previa" className="w-24 h-24 rounded-md border border-gray-300 shadow-md" />
                </div>
            )}

            {/* Inputs y botón a la derecha */}
            <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-semibold text-gray-700">Foto de Perfil:</label>
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
                    className="border p-2 rounded w-full text-gray-700 bg-white"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start">
                    Cambiar Foto
                </button>
            </div>
        </div>

    );
}
