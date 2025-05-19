"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const FILTER_URL = "http://localhost:3005/api/person/filtered";

const normalizeText = (text) => {
  if (!text) return "";
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const tiposUsuarios = ["alumno", "profesor", "personal"];
const tiposTitulacion = ["Grado", "Máster"];
const titulaciones = {
  Grado: [
    "Grado en Diseño Digital",
    "Grado en Ingeniería del Software",
    "Ingeniería de software",
    "Doble grado de Ingeniería del software y Matemáticas Computacionales",
    "Animación",
  ],
  Máster: ["Máster en Programación de Videojuegos", "Máster en Big Data"],
};
const cursos = ["1º", "2º", "3º", "4º"];
const modalidades = ["Presencial", "Online"];
const cargos = [
  "Profesor",
  "Profesor Titular",
  "Administrativo",
  "Coordinadora",
  "Coordinadora Académica",
  "Conserje",
];
const departamentos = [
  "Ciencias de la Computación",
  "Ciberseguridad",
  "Ingeniería del Software",
  "Animación",
  "Ingeniería ",
];

const schema = yup.object().shape({
  tipoUsuario: yup.string().required("Selecciona un tipo de usuario"),
  tipoTitulacion: yup.string().when("tipoUsuario", {
    is: "alumno",
    then: (schema) => schema.required("Selecciona tipo de titulación"),
  }),
  titulacion: yup.string().when("tipoUsuario", {
    is: "alumno",
    then: (schema) => schema.required("Selecciona titulación"),
  }),
  curso: yup.string().when("tipoUsuario", {
    is: "alumno",
    then: (schema) => schema.required("Selecciona curso"),
  }),
  modalidad: yup.string().when("tipoUsuario", {
    is: "alumno",
    then: (schema) => schema.required("Selecciona modalidad"),
  }),
  cargo: yup.string().when("tipoUsuario", {
    is: (val) => val === "profesor" || val === "personal",
    then: (schema) => schema.required("Selecciona cargo"),
  }),
  departamento: yup.string().when("tipoUsuario", {
    is: "profesor",
    then: (schema) => schema.required("Selecciona departamento"),
  }),
});
export default function PersonalDataFiltered() {
  const router = useRouter();
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [isCargando, setIsCargando] = useState(false);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tipoUsuario: "",
      tipoTitulacion: "",
      titulacion: "",
      curso: "",
      cargo: "",
      departamento: "",
      modalidad: "",
    },
  });

  const tipoUsuario = watch("tipoUsuario");
  const tipoTitulacion = watch("tipoTitulacion");

  useEffect(() => {
    const filtrosGuardados =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("filtrosCarnets")) || {}
        : {};
    reset(filtrosGuardados);
  }, [reset]);
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPeople(people);
    } else {
      const normalizedSearch = normalizeText(searchTerm);
      const filtered = people.filter((person) => {
        const normalizedNombre = normalizeText(person.nombre || "");
        const normalizedApellidos = normalizeText(person.apellidos || "");
        const fullName = `${normalizedNombre} ${normalizedApellidos}`;
        return (
          normalizedNombre.includes(normalizedSearch) ||
          normalizedApellidos.includes(normalizedSearch) ||
          fullName.includes(normalizedSearch)
        );
      });
      setFilteredPeople(filtered);
    }
  }, [searchTerm, people]);

  const onSubmit = async (formData) => {
  const cleanedData = { ...formData };

  // Elimina los campos que no aplican según tipoUsuario
  if (cleanedData.tipoUsuario !== "alumno") {
    delete cleanedData.tipoTitulacion;
    delete cleanedData.titulacion;
    delete cleanedData.curso;
    delete cleanedData.modalidad;
  }
  if (cleanedData.tipoUsuario !== "profesor" && cleanedData.tipoUsuario !== "personal") {
    delete cleanedData.cargo;
  }
  if (cleanedData.tipoUsuario !== "profesor") {
    delete cleanedData.departamento;
  }


  const params = new URLSearchParams();
  Object.entries(cleanedData).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  try {
    const response = await fetch(`${FILTER_URL}?${params.toString()}`);
    const data = await response.json();
    setPeople(data);
    setFilteredPeople(data);
    setSearchTerm("");
    setSelectedPeople([]);
  } catch (error) {
    console.error("Error fetching filtered data:", error);
  }
};


  const handleSelectPerson = (person) => {
    setSelectedPeople((prev) => {
      const exists = prev.some((p) => p.dni === person.dni);
      return exists
        ? prev.filter((p) => p.dni !== person.dni)
        : [...prev, person];
    });
  };

  const isPersonSelected = (person) =>
    selectedPeople.some((p) => p.dni === person.dni);

  const handleSelectAll = () => {
    if (filteredPeople.every(isPersonSelected)) {
      setSelectedPeople((prev) =>
        prev.filter((p) => !filteredPeople.some((fp) => fp.dni === p.dni))
      );
    } else {
      const newSelected = [...selectedPeople];
      filteredPeople.forEach((person) => {
        if (!isPersonSelected(person)) {
          newSelected.push(person);
        }
      });
      setSelectedPeople(newSelected);
    }
  };

  const handleNext = () => {
    localStorage.setItem("selectedPeople", JSON.stringify(selectedPeople));
    if (selectedPeople.length > 0) {
      router.push("/pages/preview");
    } else {
      alert("Selecciona al menos una persona");
    }
  };

  const exportarDatosEImagenes = async () => {
    const zip = new JSZip();
    const imageFolder = zip.folder("Fotos");

    const imagePromises = selectedPeople.map(async (person) => {
      if (person.foto) {
        try {
          const response = await fetch(person.foto);
          const blob = await response.blob();
          const fileName = `foto_${person.nombre}_${person.apellidos}.jpg`;
          imageFolder.file(fileName, blob);
          return { dni: person.dni, fileName };
        } catch {
          return { dni: person.dni, fileName: "No disponible" };
        }
      }
      return { dni: person.dni, fileName: "No disponible" };
    });

    const imageData = await Promise.all(imagePromises);

    const data = selectedPeople.map((person) => {
      const ocupacion =
        person.tipoUsuario === "alumno"
          ? `${person.tipoTitulacion} ${person.titulacion}`
          : person.tipoUsuario === "profesor"
          ? `${person.cargo} ${person.departamento}`
          : person.cargo;

      const nombreCompleto = `${person.nombre} ${person.apellidos}`;
      const imageInfo = imageData.find((img) => img.dni === person.dni);
      const fotoFileName = imageInfo ? imageInfo.fileName : "No disponible";

      return {
        "Nombre Completo": nombreCompleto,
        Ocupación: ocupacion,
        DNI: person.dni,
        Foto: fotoFileName,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personas");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    zip.file("personas.xlsx", excelBuffer);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "Personas_Fotos.zip");
  };

  const descargarLogs = async () => {
    try {
      setIsCargando(true);
      const res = await fetch("http://localhost:3005/api/auth/notify-errors");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error ejecutando revisión");

      const blob = new Blob([data.logs], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "logs_correos_enviados.txt");
      alert(data.message);
    } catch (error) {
      console.error("Error al generar los logs o enviar correos:", error);
      alert("Hubo un error al ejecutar la acción. Revisa la consola.");
    } finally {
      setIsCargando(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 mb-6 flex-wrap">
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              className="w-full pl-10 py-2 border border-gray-300 rounded-full"
              placeholder="Buscar persona"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img
              src="/images/Buscador.png"
              alt="Buscar"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
            />
          </div>

          <select {...register("tipoUsuario")} className="p-2 border rounded-full">
            <option value="">Tipo de usuario</option>
            {tiposUsuarios.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.tipoUsuario && (
            <p className="text-red-500 text-sm">{errors.tipoUsuario.message}</p>
          )}

          {tipoUsuario === "alumno" && (
            <>
              <select {...register("tipoTitulacion")} className="p-2 border rounded-full">
                <option value="">Tipo de titulación</option>
                {tiposTitulacion.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.tipoTitulacion && (
                <p className="text-red-500 text-sm">{errors.tipoTitulacion.message}</p>
              )}

              <select {...register("titulacion")} className="p-2 border rounded-full">
                <option value="">Titulación</option>
                {tipoTitulacion &&
                  titulaciones[tipoTitulacion]?.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
              {errors.titulacion && (
                <p className="text-red-500 text-sm">{errors.titulacion.message}</p>
              )}

              <select {...register("curso")} className="p-2 border rounded-full">
                <option value="">Curso</option>
                {cursos.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.curso && (
                <p className="text-red-500 text-sm">{errors.curso.message}</p>
              )}

              <select {...register("modalidad")} className="p-2 border rounded-full">
                <option value="">Modalidad</option>
                {modalidades.map((m, i) => (
                  <option key={i} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.modalidad && (
                <p className="text-red-500 text-sm">{errors.modalidad.message}</p>
              )}
            </>
          )}

          {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
            <>
              <select {...register("cargo")} className="p-2 border rounded-full">
                <option value="">Cargo</option>
                {cargos.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.cargo && (
                <p className="text-red-500 text-sm">{errors.cargo.message}</p>
              )}
            </>
          )}

          {tipoUsuario === "profesor" && (
            <>
              <select {...register("departamento")} className="p-2 border rounded-full">
                <option value="">Departamento</option>
                {departamentos.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.departamento && (
                <p className="text-red-500 text-sm">{errors.departamento.message}</p>
              )}
            </>
          )}

          <button
            type="submit"
            className="bg-[#0065ef] text-white px-6 py-2 rounded-full hover:bg-[#0056cc] transition"
          >
            Buscar
          </button>
        </div>
      </form>
      <div className="mt-4 flex justify-end w-full">
        <button
          onClick={handleNext}
          className="bg-[#0065ef] hover:bg-[#0056cc] text-white px-6 py-2 rounded-full font-semibold transition"
          disabled={selectedPeople.length === 0}
        >
          Siguiente
        </button>
      </div>

      <div className="flex items-center gap-4 px-2 mb-4">
        <button
          onClick={() => descargarCarnetsComoPNG(true)}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
        >
          <img src="/images/download_icon.png" className="w-4 h-4" alt="Transparente" />
          Transparente
        </button>

        <button
          onClick={() => descargarCarnetsComoPNG(false)}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
        >
          <img src="/images/print_icon.png" className="w-4 h-4" alt="Visible" />
          Visible
        </button>

        <button
          onClick={exportarDatosEImagenes}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
        >
          <img src="/images/datos.png" className="w-4 h-4" alt="Exportar Excel" />
          Exportar
        </button>

        <button
          onClick={descargarLogs}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
        >
          <img src="/images/logs.png" className="w-4 h-4" alt="Logs" />
          Logs
        </button>
      </div>

      {filteredPeople.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">
                  <button
                    onClick={handleSelectAll}
                    className="text-[#0065ef] hover:underline font-semibold"
                  >
                    {filteredPeople.every(isPersonSelected)
                      ? "Deseleccionar todo"
                      : "Seleccionar todo"}
                  </button>
                </th>
                {[
                  { label: "Nombre", key: "nombre" },
                  { label: "Apellidos", key: "apellidos" },
                  ...(tipoUsuario === "alumno"
                    ? [
                        { label: "Tipo Titulación", key: "tipoTitulacion" },
                        { label: "Titulación", key: "titulacion" },
                        { label: "Curso", key: "curso" },
                      ]
                    : tipoUsuario === "profesor" || tipoUsuario === "personal"
                    ? [
                        { label: "Cargo", key: "cargo" },
                        { label: "Departamento", key: "departamento" },
                      ]
                    : []),
                  { label: "DNI", key: "dni" },
                  { label: "Modalidad", key: "modalidad" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.key && (
                        <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...filteredPeople]
                .sort((a, b) => {
                  const aVal = a[sortField] ?? "";
                  const bVal = b[sortField] ?? "";

                  if (typeof aVal === "number" && typeof bVal === "number") {
                    return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
                  }

                  return sortDirection === "asc"
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
                })
                .map((person, index) => (
                  <tr
                    key={index}
                    onClick={() => handleSelectPerson(person)}
                    className={`transition-all duration-200 ease-in-out rounded-md cursor-pointer ${
                      isPersonSelected(person)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50 hover:scale-[1.01] hover:shadow-md"
                    }`}
                  >
                    <td className="px-4 py-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isPersonSelected(person)}
                        onChange={() => handleSelectPerson(person)}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-[#0065ef]"
                      />
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </td>
                    <td className="px-4 py-2">{person.nombre}</td>
                    <td className="px-4 py-2">{person.apellidos}</td>

                    {tipoUsuario === "alumno" && (
                      <>
                        <td className="px-4 py-2">{person.tipoTitulacion || "-"}</td>
                        <td className="px-4 py-2">{person.titulacion || "-"}</td>
                        <td className="px-4 py-2">{person.curso || "-"}</td>
                      </>
                    )}

                    {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
                      <>
                        <td className="px-4 py-2">{person.cargo || "-"}</td>
                        <td className="px-4 py-2">{person.departamento || "-"}</td>
                      </>
                    )}

                    <td className="px-4 py-2">{person.dni}</td>
                    <td className="px-4 py-2">{person.modalidad || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] mt-10 text-center text-gray-500">
          <img
            src="/images/flecha.png"
            alt="Flecha indicador"
            className="mb-4 w-[150px] h-auto"
          />
          <p className="text-xl font-semibold">
            Busca o selecciona tipo de usuario
          </p>
        </div>
      )}

      {isCargando && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Enviando correos...</h2>
            <p className="text-sm text-gray-600">Por favor, espera unos segundos.</p>

            <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-blue-500 animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  