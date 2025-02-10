"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "@/app/styles/FilterForm.css";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object().shape({
  filterType: Yup.string().required("Selecciona una opción"),
  searchValue: Yup.string().required("Este campo es obligatorio"),
});

export default function FilterForm() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    filterType: "",
    searchValue: "",
  });

  const handleSubmit = (values) => {
    console.log(values);
    if (values.filterType === "grupo") {
      router.push(`/pages/grupos?grupo=${values.searchValue}`);
    } else {
      router.push(`/pages/alumnos?alumno=${values.searchValue}`);
    }
  };

  return (
    <div className="contenedorFiltro bg-white flex-wrap justify-items-center p-10 shadow-md border rounded-lg">
      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="flex-wrap">
            <h1 className="titulo font-bold mb-5">Filtrar búsqueda</h1>
            <div>
              <Field as="select" name="filterType" className="inputFiltro border rounded-md">
                <option value="">Selecciona un filtro</option>
                <option value="grupo">Filtrar por grupo</option>
                <option value="alumno">Buscar alumno</option>
              </Field>
            </div>
            <div>
              <Field name="searchValue" type="text" placeholder="Ingresa el valor" className="inputFiltro border rounded-md"/>
            </div>
            <button type="submit" className="bg-blue-300 w-[300px] border border-cyan-500 rounded-lg mt-5 hover:bg-blue-400">
              Buscar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
