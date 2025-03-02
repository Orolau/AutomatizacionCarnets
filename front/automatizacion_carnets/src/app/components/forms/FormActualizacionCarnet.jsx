"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";

export default function FormActualizacionCarnet({ carnet, setCarnet }) {
    const [previewFoto, setPreviewFoto] = useState(carnet.foto);
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
            departamento: carnet.departamento || ""
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es obligatorio"),
            apellidos: Yup.string().required("Los apellidos son obligatorios"),
            dni: Yup.string().required("El DNI es obligatorio"),
            tipoUsuario: Yup.string()
                .oneOf(["alumno", "personal", "profesor"], "Tipo de usuario inválido")
                .required("El tipo de usuario es obligatorio"),
            cargo: Yup.string().when("tipoUsuario", {
                is: (tipo) => tipo !== "alumno",
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
            updatePersonData(carnet._id, values);
        }
    });

    useEffect(() => {
        formik.setValues({ ...formik.values, ...carnet });
    }, [carnet]);

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewFoto(reader.result);
            reader.readAsDataURL(file);
            setFileToUpload(file);
        }
    }

    const updatePersonData = async (id, data) => {
        try {
            const response = await fetch(`http://localhost:3005/api/person/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            console.log(response.body)
            if (!response.ok) throw new Error("Error al actualizar los datos");
            console.log("Datos actualizados correctamente");
        } catch (error) {
            console.error("Error en updatePersonData:", error);
        }
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-3 p-4 shadow-md rounded bg-blue-100 text-black h-[50vh] overflow-auto relative"
        >
            <h2 className="text-lg font-bold text-center mb-2">Modificar datos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="text-sm font-semibold text-gray-700">Nombre:</label>
                    <input type="text" name="nombre" value={formik.values.nombre} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    {formik.errors.nombre && <p className="text-red-500 text-xs">{formik.errors.nombre}</p>}
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700">Apellidos:</label>
                    <input type="text" name="apellidos" value={formik.values.apellidos} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    {formik.errors.apellidos && <p className="text-red-500 text-xs">{formik.errors.apellidos}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="text-sm font-semibold text-gray-700">DNI:</label>
                    <input type="text" name="dni" value={formik.values.dni} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    {formik.errors.dni && <p className="text-red-500 text-xs">{formik.errors.dni}</p>}
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700">Tipo de Usuario:</label>
                    <select name="tipoUsuario" value={formik.values.tipoUsuario} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700">
                        <option value="alumno">Alumno</option>
                        <option value="profesor">Profesor</option>
                        <option value="personal">Personal</option>
                    </select>
                </div>
            </div>

            {formik.values.tipoUsuario === 'alumno' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Tipo de Titulación:</label>
                        <input type="text" name="tipoTitulacion" value={formik.values.tipoTitulacion} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Titulación:</label>
                        <input type="text" name="titulacion" value={formik.values.titulacion} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    </div>
                </div>
            )}

            {formik.values.tipoUsuario !== 'alumno' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Cargo:</label>
                        <input type="text" name="cargo" value={formik.values.cargo} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                    </div>
                    {formik.values.tipoUsuario === 'profesor' && (
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Departamento:</label>
                            <input type="text" name="departamento" value={formik.values.departamento} onChange={formik.handleChange} className="border p-2 rounded w-full text-gray-700" />
                        </div>
                    )}
                </div>
            )}

            {/* Botón fijo en la parte inferior del contenedor */}
            <div className="absolute bottom-4 left-0 w-full flex justify-center">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-[90%] max-w-sm">
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
}
