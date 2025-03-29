"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";

export default function FormActualizacionCarnet({ carnet, setCarnet }) {
    const [previewFoto, setPreviewFoto] = useState(carnet.foto);

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

    const updatePersonData = async (id, data) => {
        try {
            const response = await fetch(`http://localhost:3005/api/person/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error al actualizar los datos");
            console.log("Datos actualizados correctamente");
        } catch (error) {
            console.error("Error en updatePersonData:", error);
        }
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            {[
                { label: "Nombre", name: "nombre" },
                { label: "Apellidos", name: "apellidos" },
                { label: "DNI", name: "dni" },
                { label: "Tipo de Usuario", name: "tipoUsuario", type: "select" },
                { label: "Tipo de Titulación", name: "tipoTitulacion", condition: formik.values.tipoUsuario === "alumno" },
                { label: "Titulación", name: "titulacion", condition: formik.values.tipoUsuario === "alumno" },
                { label: "Cargo", name: "cargo", condition: formik.values.tipoUsuario !== "alumno" },
                { label: "Departamento", name: "departamento", condition: formik.values.tipoUsuario === "profesor" },
            ].map(({ label, name, type, condition }) => {
                if (condition === false) return null;

                return (
                    <div key={name}>
                        <label className="text-sm font-medium text-gray-700">{label}:</label>
                        {type === "select" ? (
                            <select
                                name={name}
                                value={formik.values[name]}
                                onChange={formik.handleChange}
                                className="w-full px-4 py-2 rounded-full border bg-white focus:outline-none text-sm"
                            >
                                <option value="alumno">Alumno</option>
                                <option value="profesor">Profesor</option>
                                <option value="personal">Personal</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                name={name}
                                value={formik.values[name]}
                                onChange={formik.handleChange}
                                className="w-full px-4 py-2 rounded-full border bg-white focus:outline-none text-sm"
                            />
                        )}
                        {formik.errors[name] && (
                            <p className="text-xs text-red-500">{formik.errors[name]}</p>
                        )}
                    </div>
                );
            })}
        </form>
    );
}
