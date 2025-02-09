"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "@/app/styles/FilterForm.css";
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
    <div className="contenedorFiltro">
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
          <Form className="formFiltro">
            <h1 className="titulo">Filtrar búsqueda</h1>

            {/* Selección de tipo de filtro */}
            <div>
              <Field as="select" name="filterType" className="inputFiltro" onChange={(e) => {
                setFieldValue("filterType", e.target.value);
                setFilterType(e.target.value);
              }}>
                <option value="">Selecciona un filtro</option>
                <option value="grupo">Filtrar por grupo</option>
                <option value="alumno">Buscar alumno</option>
              </Field>
            </div>

            {/* Campos comunes */}
            {values.filterType && (
              <>
                <div>
                  <Field as="select" name="titulacion" className="inputFiltro">
                    <option value="">Selecciona la titulación</option>
                    <option value="ingenieria">Ingeniería</option>
                    <option value="diseño">Diseño</option>
                  </Field>
                </div>

                <div>
                  <Field as="select" name="clase" className="inputFiltro">
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
                <Field as="select" name="alumno" className="inputFiltro">
                  <option value="">Selecciona un alumno</option>
                  <option value="juan">Juan Pérez</option>
                  <option value="maria">María López</option>
                </Field>
              </div>
            )}

            <button type="submit" className="btnFiltro">Buscar</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
