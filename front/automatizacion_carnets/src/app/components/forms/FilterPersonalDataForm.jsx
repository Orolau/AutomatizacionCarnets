"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FILTER_URL = "http://localhost:3005/api/person/filtered";

const normalizeText = (text) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

const tiposUsuarios = ["alumno", "profesor", "personal"];
const tiposTitulacion = ["Grado", "Máster"];
const titulaciones = {
    "Grado": [
        "Grado en Diseño Digital",
        "Grado en Ingeniería del Software",
        "Ingeniería de software",
        "Doble grado de Ingeniería del software y Matemáticas Computacionales",
        "Animación"
    ],
    "Máster": [
        "Máster en Programación de Videojuegos",
        "Máster en Big Data"
    ]
};
const cursos = ["1º", "2º", "3º", "4º"];
const modalidades = ["Presencial", "Online"];
const cargos = [
    "Profesor", "Profesor Titular", "Administrativo",
    "Coordinadora", "Coordinadora Académica", "Conserje", "Alumno"
];
const departamentos = [
    "Ciencias de la Computación", "Ciberseguridad",
    "Ingeniería del Software", "Animación", "Ingeniería "
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
            const filtered = people.filter(person => {
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
        if (modalidad && tipoUsuario === "alumno") params.append("modalidad", modalidad);

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
            const exists = prev.some(p => p.id === person.id);
            return exists
                ? prev.filter(p => p.id !== person.id)
                : [...prev, person];
        });
    };

    const isPersonSelected = (person) =>
        selectedPeople.some(p => p.id === person.id);

    const handleSelectAll = () => {
        if (filteredPeople.every(isPersonSelected)) {
            setSelectedPeople(prev =>
                prev.filter(p => !filteredPeople.some(fp => fp.id === p.id))
            );
        } else {
            const newSelected = [...selectedPeople];
            filteredPeople.forEach(person => {
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
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Contenedor Buscador + Filtros */}
            <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
                {/* Buscador */}
                <div className="mb-4">
                    <div className="relative">
                        <img
                            src="/images/Buscador.png"
                            alt="Buscar"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                        />
                        <input
                            type="text"
                            className="w-full pl-10 py-2 border border-gray-300 rounded-2xl bg-white"
                            placeholder="Buscar por nombre o apellidos..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Tipo de usuario</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-2xl bg-white"
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value)}
                        >
                            <option value="">Tipo de usuario</option>
                            {tiposUsuarios.map((tipo, index) => (
                                <option key={index} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>

                    {tipoUsuario === "alumno" && (
                        <>
                            <div>
                                <label className="block font-semibold mb-1">Curso</label>
                                <select className="w-full p-2 border border-gray-300 rounded-2xl bg-white" value={curso} onChange={(e) => setCurso(e.target.value)}>
                                    <option value="">Seleccionar curso</option>
                                    {cursos.map((c, index) => <option key={index} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Modalidad</label>
                                <select className="w-full p-2 border border-gray-300 rounded-2xl bg-white" value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                                    <option value="">Seleccionar modalidad</option>
                                    {modalidades.map((mod, index) => <option key={index} value={mod}>{mod}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Tipo titulación</label>
                                <select className="w-full p-2 border border-gray-300 rounded-2xl bg-white" value={tipoTitulacion} onChange={(e) => {
                                    setTipoTitulacion(e.target.value);
                                    setTitulacion("");
                                }}>
                                    <option value="">Tipo titulación</option>
                                    {tiposTitulacion.map((mod, index) => <option key={index} value={mod}>{mod}</option>)}
                                </select>
                            </div>

                            {tipoTitulacion && (
                                <div>
                                    <label className="block font-semibold mb-1">Titulación</label>
                                    <select className="w-full p-2 border border-gray-300 rounded-2xl bg-white" value={titulacion} onChange={(e) => setTitulacion(e.target.value)}>
                                        <option value="">Titulación</option>
                                        {titulaciones[tipoTitulacion]?.map((tit, index) => <option key={index} value={tit}>{tit}</option>)}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
                        <div>
                            <label className="block font-semibold mb-1">Cargo</label>
                            <select className="w-full p-2 border border-gray-300 rounded-2xl bg-white" value={cargo} onChange={(e) => setCargo(e.target.value)}>
                                <option value="">Seleccionar cargo</option>
                                {cargos.map((c, index) => <option key={index} value={c}>{c}</option>)}
                            </select>
                        </div>
                    )}

                    {tipoUsuario === "profesor" && (
                        <div>
                            <label className="block font-semibold mb-1">Departamento</label>
                            <select className="w-full p-2 border border-gray-300 rounded-2xl bg-white" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
                                <option value="">Seleccionar departamento</option>
                                {departamentos.map((d, index) => <option key={index} value={d}>{d}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <button
                    className="mt-6 px-6 py-2 bg-[#0065ef] text-white rounded-xl hover:bg-[#0056cc] transition w-full md:w-auto"
                    onClick={handleFilter}
                >
                    Buscar
                </button>
            </div>


            {/* Tabla */}
            {filteredPeople.length > 0 && (
                <div className="bg-white p-4 rounded-3xl shadow-md mb-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100 text-gray-700 text-left">
                            <tr>
                                <th className="px-4 py-3">
                                    <button
                                        onClick={handleSelectAll}
                                        className="text-[#0065ef] hover:underline font-semibold"
                                    >
                                        {filteredPeople.every(isPersonSelected) ? "Deseleccionar todo" : "Seleccionar todo"}
                                    </button>
                                </th>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Apellidos</th>
                                {tipoUsuario === "alumno" && <th className="px-4 py-3">Tipo Titulación</th>}
                                {tipoUsuario === "alumno" && <th className="px-4 py-3">Titulación</th>}
                                {tipoUsuario === "profesor" && <th className="px-4 py-3">Departamento</th>}
                                {tipoUsuario !== "alumno" && <th className="px-4 py-3">Cargo</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPeople.map((person, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={isPersonSelected(person)}
                                            onChange={() => handleSelectPerson(person)}
                                            className="accent-[#0065ef]"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{person.nombre}</td>
                                    <td className="px-4 py-2">{person.apellidos}</td>
                                    {tipoUsuario === "alumno" && <td className="px-4 py-2">{person.tipoTitulacion}</td>}
                                    {tipoUsuario === "alumno" && <td className="px-4 py-2">{person.titulacion}</td>}
                                    {tipoUsuario === "profesor" && <td className="px-4 py-2">{person.departamento}</td>}
                                    {tipoUsuario !== "alumno" && <td className="px-4 py-2">{person.cargo}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Botón Siguiente */}
            <button
                className="w-full md:w-auto px-6 py-3 bg-[#0065ef] text-white rounded-xl hover:bg-[#0056cc] transition mx-auto block"
                onClick={handleNext}
                disabled={selectedPeople.length === 0}
            >
                Siguiente
            </button>
        </div>
    );

}