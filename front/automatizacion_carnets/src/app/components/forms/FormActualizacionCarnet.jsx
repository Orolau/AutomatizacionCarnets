"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";

export default function FormActualizacionCarnet({ carnet, setCarnet }) {
    const [previewFoto, setPreviewFoto] = useState(carnet.foto);
    const [tipoUsuario, setTipoUsuario] = useState(carnet.tipoUsuario || 'alumno');
    const [fileToUpload, setFileToUpload] = useState(null);

    const formik = useFormik({
        initialValues: {
            nombre: carnet.nombre || "",
            apellidos: carnet.apellidos || "",
            dni: carnet.dni || "",
            tipoUsuario: carnet.tipoUsuario || "alumno",
            tipoTitulacion: carnet.tipoTitulacion || "",
            titulacion: carnet.titulacion || "",
            cargo: carnet.cargo || "",
            departamento: carnet.departamento || "",
            foto: carnet.foto || "",
            _id: carnet._id || ""
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es obligatorio"),
            apellidos: Yup.string().required("Los apellidos son obligatorios"),
            dni: Yup.string().required("El DNI es obligatorio"),
            tipoUsuario: Yup.string()
                .oneOf(["alumno", "personal", "profesor"], "Tipo de usuario inválido")
                .required("El tipo de usuario es obligatorio"),
            cargo: Yup.string().when("tipoUsuario", {
                is: (tipo) => tipo === "profesor" || tipo === "personal",
                then: (schema) => schema.required("El cargo es obligatorio"),
            }),
            departamento: Yup.string().when("tipoUsuario", {
                is: "profesor",
                then: (schema) => schema.required("El departamento es obligatorio"),
            }),
            tipoTitulacion: Yup.string().when("tipoUsuario", {
                is: "alumno",
                then: (schema) => schema.required("El tipo de titulación es obligatorio"),
            }),
            titulacion: Yup.string().when("tipoUsuario", {
                is: "alumno",
                then: (schema) => schema.required("La titulación es obligatoria"),
            }),
        }),
        onSubmit: (values) => {
            setCarnet({ ...values, foto: previewFoto });
            updatePersonData(carnet._id, carnet, fileToUpload);
        }
    });

    useEffect(() => {
        if (carnet.dni) {
            formik.setValues({
                nombre: carnet.nombre || "",
                apellidos: carnet.apellidos || "",
                dni: carnet.dni || "",
                tipoTitulacion: carnet.tipoTitulacion || "",
                titulacion: carnet.titulacion || "",
                tipoUsuario: carnet.tipoUsuario || "alumno",
                departamento: carnet.departamento || "",
                cargo: carnet.cargo || "",
                foto: carnet.foto || "",
                _id: carnet._id || ""
            });
        }
    }, [carnet]);



    function handleTipoUsuarioChange(event) {
        const selectedTipo = event.target.value;
        setTipoUsuario(selectedTipo);
        formik.setFieldValue("tipoUsuario", selectedTipo);
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFoto(reader.result); // Mostrar la vista previa de la imagen
            };
            reader.readAsDataURL(file);

            // Guardamos el archivo para subirlo a Pinata
            setFileToUpload(file); // Aquí estamos guardando el archivo
        }
    }

    function handleTipoUsuarioChange(event) {
        const selectedTipo = event.target.value;
        setTipoUsuario(selectedTipo);
        formik.setFieldValue("tipoUsuario", selectedTipo);
    }

    // Función para enviar la solicitud PUT al backend
    const updatePersonData = async (id, data, newFile) => {
        try {
            // Clonar data y eliminar el campo "foto"
            const { foto, ...dataWithoutPhoto } = data;

            // Primera solicitud: actualizar los datos de la persona sin la foto
            const response = await fetch(`http://localhost:3005/api/person/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataWithoutPhoto) // Enviar los datos sin la imagen
            });

            if (!response.ok) {
                throw new Error("Error al actualizar los datos de la persona");
            }

            // Si hay una nueva foto, hacer la segunda solicitud para actualizarla
            if (newFile) {
                const formData = new FormData();
                formData.append("foto", newFile);

                const photoResponse = await fetch(`http://localhost:3005/api/person/updatePhoto/${id}`, {
                    method: "PUT",
                    body: formData
                });

                if (!photoResponse.ok) {
                    throw new Error("Error al actualizar la foto");
                }
            }

            console.log("Datos y foto actualizados correctamente");
        } catch (error) {
            console.error("Error en updatePersonData:", error);
        }
    };




    return (
        <form
            onSubmit={formik.handleSubmit}
            className="mt-4 flex flex-col gap-3 bg-blue-100 p-4 shadow-md rounded text-black h-[80vh] overflow-auto"
        >
            {/* Nombre y Apellidos */}
            <div className="flex flex-wrap gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700">Nombre:</label>
                    <input type="text" name="nombre" value={formik.values.nombre} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    {formik.errors.nombre && <p className="text-red-500 text-xs">{formik.errors.nombre}</p>}
                </div>
                <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700">Apellidos:</label>
                    <input type="text" name="apellidos" value={formik.values.apellidos} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    {formik.errors.apellidos && <p className="text-red-500 text-xs">{formik.errors.apellidos}</p>}
                </div>
            </div>

            {/* DNI y Tipo de Usuario */}
            <div className="flex flex-wrap gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700">DNI:</label>
                    <input type="text" name="dni" value={formik.values.dni} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    {formik.errors.dni && <p className="text-red-500 text-xs">{formik.errors.dni}</p>}
                </div>
                <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700">Tipo de Usuario:</label>
                    <select name="tipoUsuario" value={formik.values.tipoUsuario} onChange={handleTipoUsuarioChange} className="border p-2 rounded w-full text-gray-700">
                        <option value="alumno">Alumno</option>
                        <option value="profesor">Profesor</option>
                        <option value="personal">Personal</option>
                    </select>
                    {formik.errors.tipoUsuario && <p className="text-red-500 text-xs">{formik.errors.tipoUsuario}</p>}
                </div>
            </div>

            {/* Campos específicos según el tipo de usuario */}
            {formik.values.tipoUsuario === 'alumno' && (
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-gray-700">Tipo de Titulación:</label>
                        <input type="text" name="tipoTitulacion" value={formik.values.tipoTitulacion} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                        {formik.errors.tipoTitulacion && <p className="text-red-500 text-xs">{formik.errors.tipoTitulacion}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-gray-700">Titulación:</label>
                        <input type="text" name="titulacion" value={formik.values.titulacion} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                        {formik.errors.titulacion && <p className="text-red-500 text-xs">{formik.errors.titulacion}</p>}
                    </div>
                </div>
            )}

            {(formik.values.tipoUsuario === 'profesor' || formik.values.tipoUsuario === 'personal') && (
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-gray-700">Cargo:</label>
                        <input type="text" name="cargo" value={formik.values.cargo} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                        {formik.errors.cargo && <p className="text-red-500 text-xs">{formik.errors.cargo}</p>}
                    </div>
                    {formik.values.tipoUsuario === 'profesor' && (
                        <div className="flex-1">
                            <label className="text-sm font-semibold text-gray-700">Departamento:</label>
                            <input type="text" name="departamento" value={formik.values.departamento} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                            {formik.errors.departamento && <p className="text-red-500 text-xs">{formik.errors.departamento}</p>}
                        </div>
                    )}
                </div>
            )}

            <label className="text-sm font-semibold text-gray-700">Foto de Perfil:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded" />
            {previewFoto && <img src={previewFoto} alt="Vista previa" className="w-20 h-20 mt-2" />}

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Guardar Cambios
            </button>
        </form>
    );
}
