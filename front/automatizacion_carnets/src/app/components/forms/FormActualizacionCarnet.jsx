"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";

export default function FormActualizacionCarnet({ carnet, setCarnet }) {
    const [previewFoto, setPreviewFoto] = useState(carnet.foto);
    const [tipoUsuario, setTipoUsuario] = useState(carnet.tipoUsuario || 'alumno'); // Añadido para gestionar el tipo de usuario
    
    const formik = useFormik({
        initialValues: {
            nombre: carnet.nombre,
            dni: carnet.dni,
            tipoUsuario: tipoUsuario,
            tipoTitulacion: carnet.tipoTitulacion || '',
            titulacion: carnet.titulacion || '',
            cargo: carnet.cargo || '',
            departamento: carnet.departamento || '',
            foto: carnet.foto
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es obligatorio"),
            dni: Yup.string().required("El DNI es obligatorio"),
            tipoUsuario: Yup.string().required("El tipo de usuario es obligatorio"),
            // Agregar validaciones específicas para cada tipo de usuario
            ...(carnet.tipoUsuario === 'alumno' && {
                tipoTitulacion: Yup.string().required("El tipo de titulación es obligatorio"),
                titulacion: Yup.string().required("La titulación es obligatoria")
            }),
            ...(carnet.tipoUsuario === 'profesor' && {
                cargo: Yup.string().required("El cargo es obligatorio"),
                departamento: Yup.string().required("El departamento es obligatorio")
            }),
            ...(carnet.tipoUsuario === 'personal' && {
                cargo: Yup.string().required("El cargo es obligatorio")
            })
        }),
        onSubmit: (values) => {
            setCarnet({ ...values, foto: previewFoto });
        }
    });
    
    useEffect(() => {
        if (carnet.dni) {
            formik.setValues({
                nombre: carnet.nombre || "",
                dni: carnet.dni || "",
                tipoTitulacion: carnet.tipoTitulacion || "",
                titulacion: carnet.titulacion || "",
                tipoUsuario: carnet.tipoUsuario || "alumno",
                foto: carnet.foto || ""
            });
        }
    }, [carnet]);

    function handleFileChange(event) {
        console.log(carnet)
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleTipoUsuarioChange(event) {
        const selectedTipo = event.target.value;
        setTipoUsuario(selectedTipo);
        formik.setFieldValue("tipoUsuario", selectedTipo); // Actualiza el estado en Formik
    }

    return (
        <form onSubmit={formik.handleSubmit} className="mt-4 flex flex-col gap-3 bg-blue-100 p-4 shadow-md rounded text-black">
            <label className="text-sm font-semibold text-gray-700">Nombre:</label>
            <input
                type="text"
                name="nombre"
                value={formik.values.nombre} 
                onChange={formik.handleChange}
                className="border p-2 rounded text-gray-700"
            />
            {formik.errors.nombre && <p className="text-red-500 text-xs">{formik.errors.nombre}</p>}

            <label className="text-sm font-semibold text-gray-700">DNI:</label>
            <input
                type="text"
                name="dni"
                value={formik.values.dni} 
                onChange={formik.handleChange}
                className="border p-2 rounded text-gray-700"
            />
            {formik.errors.dni && <p className="text-red-500 text-xs">{formik.errors.dni}</p>}

            <label className="text-sm font-semibold text-gray-700">Tipo de Usuario:</label>
            <select
                name="tipoUsuario"
                value={formik.values.tipoUsuario}  
                onChange={handleTipoUsuarioChange}
                className="border p-2 rounded text-gray-700"
            >
                <option value="alumno">Alumno</option>
                <option value="profesor">Profesor</option>
                <option value="personal">Personal</option>
            </select>
            {formik.errors.tipoUsuario && <p className="text-red-500 text-xs">{formik.errors.tipoUsuario}</p>}

            {/* Campos específicos para alumnos */}
            {formik.values.tipoUsuario === 'alumno' && (
                <>
                    <label className="text-sm font-semibold text-gray-700">Tipo de Titulación:</label>
                    <input
                        type="text"
                        name="tipoTitulacion"
                        value={formik.values.tipoTitulacion} 
                        onChange={formik.handleChange}
                        className="border p-2 rounded text-gray-700"
                    />
                    {formik.errors.tipoTitulacion && <p className="text-red-500 text-xs">{formik.errors.tipoTitulacion}</p>}

                    <label className="text-sm font-semibold text-gray-700">Titulación:</label>
                    <input
                        type="text"
                        name="titulacion"
                        value={formik.values.titulacion} 
                        onChange={formik.handleChange}
                        className="border p-2 rounded text-gray-700"
                    />
                    {formik.errors.titulacion && <p className="text-red-500 text-xs">{formik.errors.titulacion}</p>}
                </>
            )}

            {/* Campos específicos para profesores */}
            {formik.values.tipoUsuario === 'profesor' && (
                <>
                    <label className="text-sm font-semibold text-gray-700">Cargo:</label>
                    <input
                        type="text"
                        name="cargo"
                        value={formik.values.cargo}  
                        onChange={formik.handleChange}
                        className="border p-2 rounded text-gray-700"
                    />
                    {formik.errors.cargo && <p className="text-red-500 text-xs">{formik.errors.cargo}</p>}

                    <label className="text-sm font-semibold text-gray-700">Departamento:</label>
                    <input
                        type="text"
                        name="departamento"
                        value={formik.values.departamento}  
                        onChange={formik.handleChange}
                        className="border p-2 rounded text-gray-700"
                    />
                    {formik.errors.departamento && <p className="text-red-500 text-xs">{formik.errors.departamento}</p>}
                </>
            )}

            {/* Campos específicos para personal */}
            {formik.values.tipoUsuario === 'personal' && (
                <>
                    <label className="text-sm font-semibold text-gray-700">Cargo:</label>
                    <input
                        type="text"
                        name="cargo"
                        value={formik.values.cargo}  
                        onChange={formik.handleChange}
                        className="border p-2 rounded text-gray-700"
                    />
                    {formik.errors.cargo && <p className="text-red-500 text-xs">{formik.errors.cargo}</p>}
                </>
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
