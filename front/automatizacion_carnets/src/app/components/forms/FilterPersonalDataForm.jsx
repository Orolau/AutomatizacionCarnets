"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function PersonalDataFiltered() {
  const router = useRouter();
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeople, setSelectedPeople] = useState([]);

  const [tipoUsuario, setTipoUsuario] = useState("");
  const [tipoTitulacion, setTipoTitulacion] = useState("");
  const [titulacion, setTitulacion] = useState("");
  const [curso, setCurso] = useState("");
  const [cargo, setCargo] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [modalidad, setModalidad] = useState("");

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

  const handleFilter = async () => {
    const params = new URLSearchParams();
    if (tipoUsuario) params.append("tipoUsuario", tipoUsuario);
    if (tipoTitulacion) params.append("tipoTitulacion", tipoTitulacion);
    if (titulacion) params.append("titulacion", titulacion);
    if (curso) params.append("curso", curso);
    if (cargo) params.append("cargo", cargo);
    if (departamento) params.append("departamento", departamento);
    if (modalidad && tipoUsuario === "alumno")
      params.append("modalidad", modalidad);

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

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

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

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full">
      {/* Buscador y filtros */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 mb-6 flex-wrap">
        <div className="relative w-full lg:w-1/3">
          <input
            type="text"
            className="w-full pl-10 py-2 border border-gray-300 rounded-full"
            placeholder="Buscar persona"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img
            src="/images/Buscador.png"
            alt="Buscar"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
        </div>

        <select
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
          className="p-2 border border-gray-300 rounded-full"
        >
          <option value="">Tipo de usuario</option>
          {tiposUsuarios.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Filtros condicionales */}
        {tipoUsuario === "alumno" && (
          <>
            <select
              value={tipoTitulacion}
              onChange={(e) => {
                setTipoTitulacion(e.target.value);
                setTitulacion("");
              }}
              className="p-2 border border-gray-300 rounded-full"
            >
              <option value="">Tipo de titulación</option>
              {tiposTitulacion.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {tipoTitulacion && (
              <select
                value={titulacion}
                onChange={(e) => setTitulacion(e.target.value)}
                className="p-2 border border-gray-300 rounded-full"
              >
                <option value="">Titulación</option>
                {titulaciones[tipoTitulacion].map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}

            <select
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              className="p-2 border border-gray-300 rounded-full"
            >
              <option value="">Curso</option>
              {cursos.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="p-2 border border-gray-300 rounded-full"
            >
              <option value="">Modalidad</option>
              {modalidades.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </>
        )}

        {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="p-2 border border-gray-300 rounded-full"
          >
            <option value="">Cargo</option>
            {cargos.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {tipoUsuario === "profesor" && (
          <select
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            className="p-2 border border-gray-300 rounded-full"
          >
            <option value="">Departamento</option>
            {departamentos.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleFilter}
          className="bg-[#0065ef] text-white px-6 py-2 rounded-full hover:bg-[#0056cc] transition"
        >
          Buscar
        </button>
      </div>

      {/* Iconos de acción */}
      <div className="flex items-center gap-4 px-2 mb-4">
        <button><img src="/images/download_icon.png" className="w-5 h-5" alt="Descargar" /></button>
        <button><img src="/images/print_icon.png" className="w-5 h-5" alt="Imprimir" /></button>
        <button><img src="/images/delete_icon.png" className="w-5 h-5" alt="Eliminar" /></button>
        <button><img src="/images/add_icon.png" className="w-5 h-5" alt="Añadir" /></button>
        <button><img src="/images/edit_icon.png" className="w-5 h-5" alt="Editar" /></button>
      </div>

      {/* Tabla */}
      {filteredPeople.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
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
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Apellidos</th>

                {tipoUsuario === "alumno" && (
                  <>
                    <th className="px-4 py-3">Tipo Titulación</th>
                    <th className="px-4 py-3">Titulación</th>
                    <th className="px-4 py-3">Curso</th>
                  </>
                )}

                {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
                  <>
                    <th className="px-4 py-3">Cargo</th>
                    <th className="px-4 py-3">Departamento</th>
                  </>
                )}

                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Modalidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPeople.map((person, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isPersonSelected(person)}
                      onChange={() => handleSelectPerson(person)}
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
      )}

      {/* Botón Siguiente */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          className="bg-[#0065ef] hover:bg-[#0056cc] text-white px-6 py-2 rounded-full font-semibold transition"
          disabled={selectedPeople.length === 0}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
