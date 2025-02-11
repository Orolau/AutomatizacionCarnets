"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object().shape({
  filterType: Yup.string().required("Selecciona una opción"),
  titulacion: Yup.string().required("Selecciona la titulación"),
  clase: Yup.string().required("Selecciona la clase"),
  alumno: Yup.string().when("filterType", {
    is: "alumno",
    then: Yup.string().required("Selecciona un alumno"),
  }),
});

export default function FilterForm() {
  const router = useRouter();
  const [filterType, setFilterType] = useState("");

  const handleSubmit = (values) => {
    console.log(values);
    if (values.filterType === "grupo") {
      router.push(`/pages/grupos?titulacion=${values.titulacion}&clase=${values.clase}`);
    } else {
      router.push(`/pages/alumnos?titulacion=${values.titulacion}&clase=${values.clase}&alumno=${values.alumno}`);
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md mx-auto">
      <Formik
        initialValues={{
          filterType: "",
          titulacion: "",
          clase: "",
          alumno: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col gap-4 text-gray-700">
            <h1 className="text-xl font-semibold text-gray-800">Filtrar búsqueda</h1>

            {/* Selección de tipo de filtro */}
            <div>
              <label className="block mb-1">Selecciona un filtro:</label>
              <Field 
                as="select" 
                name="filterType" 
                className="w-full p-2 border rounded-md text-gray-700" 
                onChange={(e) => {
                  setFieldValue("filterType", e.target.value);
                  setFilterType(e.target.value);
                }}
              >
                <option value="">Selecciona un filtro</option>
                <option value="grupo">Filtrar por grupo</option>
                <option value="alumno">Buscar alumno</option>
              </Field>
            </div>

            {/* Campos comunes */}
            {values.filterType && (
              <>
                <div>
                  <label className="block mb-1">Titulación:</label>
                  <Field as="select" name="titulacion" className="w-full p-2 border rounded-md text-gray-700">
                    <option value="">Selecciona la titulación</option>
                    <option value="ingenieria">Ingeniería</option>
                    <option value="diseño">Diseño</option>
                  </Field>
                </div>

                <div>
                  <label className="block mb-1">Clase:</label>
                  <Field as="select" name="clase" className="w-full p-2 border rounded-md text-gray-700">
                    <option value="">Selecciona la clase</option>
                    <option value="a">Clase A</option>
                    <option value="b">Clase B</option>
                  </Field>
                </div>
              </>
            )}

            {/* Campo específico para alumnos */}
            {values.filterType === "alumno" && (
              <div>
                <label className="block mb-1">Alumno:</label>
                <Field as="select" name="alumno" className="w-full p-2 border rounded-md text-gray-700">
                  <option value="">Selecciona un alumno</option>
                  <option value="juan">Juan Pérez</option>
                  <option value="maria">María López</option>
                </Field>
              </div>
            )}

            <button 
              type="submit" 
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Buscar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
