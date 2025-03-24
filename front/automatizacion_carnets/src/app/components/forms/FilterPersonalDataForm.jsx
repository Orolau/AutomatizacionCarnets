"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3005/api/person";
const FILTER_URL = "http://localhost:3005/api/person/filtered";

// Función para normalizar texto (eliminar tildes)
const normalizeText = (text) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

export default function PersonalDataFiltered() {
    const router = useRouter();
    const [filters, setFilters] = useState({});
    const [people, setPeople] = useState([]);
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [tiposUsuarios, setTiposUsuarios] = useState([]);
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [tiposTitulacion, setTiposTitulacion] = useState([]);
    const [titulaciones, setTitulaciones] = useState({});
    const [cursos, setCursos] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [tipoTitulacion, setTipoTitulacion] = useState("");
    const [titulacion, setTitulacion] = useState("");
    const [curso, setCurso] = useState("");
    const [cargo, setCargo] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [modalidad, setModalidad] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                setTiposUsuarios([...new Set(data.map(p => p.tipoUsuario).filter(Boolean))]);
                setTiposTitulacion([...new Set(data.map(p => p.tipoTitulacion).filter(Boolean))]);
                setCursos([...new Set(data.map(p => p.curso).filter(Boolean))]);
                setCargos([...new Set(data.map(p => p.cargo).filter(Boolean))]);
                setDepartamentos([...new Set(data.map(p => p.departamento).filter(Boolean))]);
                setModalidades([...new Set(data.flatMap(p => p.modalidad).filter(Boolean))]);

                const titulacionesAgrupadas = data.reduce((acc, p) => {
                    if (p.tipoTitulacion && p.titulacion) {
                        if (!acc[p.tipoTitulacion]) acc[p.tipoTitulacion] = [];
                        if (!acc[p.tipoTitulacion].includes(p.titulacion)) {
                            acc[p.tipoTitulacion].push(p.titulacion);
                        }
                    }
                    return acc;
                }, {});
                setTitulaciones(titulacionesAgrupadas);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Filtro por nombre y apellidos en tiempo real
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPeople(people);
        } else {
            const normalizedSearch = normalizeText(searchTerm);
            const filtered = people.filter(person => {
                const normalizedNombre = normalizeText(person.nombre || "");
                const normalizedApellidos = normalizeText(person.apellidos || "");
                const fullName = `${normalizedNombre} ${normalizedApellidos}`;
                
                return normalizedNombre.includes(normalizedSearch) || 
                       normalizedApellidos.includes(normalizedSearch) || 
                       fullName.includes(normalizedSearch);
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
            setSearchTerm(""); // Reinicia el término de búsqueda
            setSelectedPeople([]); // Reinicia selecciones
        } catch (error) {
            console.error("Error fetching filtered data:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectPerson = (person) => {
        setSelectedPeople((prev) => {
            const updatedSelection = prev.some(p => p === person || (p.id && person.id && p.id === person.id))
                ? prev.filter(p => p !== person && (!p.id || !person.id || p.id !== person.id))
                : [...prev, person];
            return updatedSelection;
        });
    };

    const isPersonSelected = (person) => {
        return selectedPeople.some(p => p === person || (p.id && person.id && p.id === person.id));
    };

    const handleSelectAll = () => {
        if (filteredPeople.every(person => isPersonSelected(person))) {
            setSelectedPeople(prev => prev.filter(person => 
                !filteredPeople.some(fp => fp === person || (fp.id && person.id && fp.id === person.id))
            ));
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
        localStorage.setItem('selectedPeople', JSON.stringify(selectedPeople));
        if (selectedPeople.length > 0)
            router.push('/pages/preview');
        else
            alert('Selecciona al menos una persona');
    };
    return (
        <div className="p-4 bg-white text-black">
            <div className="p-6 bg-blue-200 rounded-xl shadow-lg mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Filtros</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <select
                        className="w-full p-2 border border-blue-400 rounded-lg bg-white"
                        value={tipoUsuario}
                        onChange={(e) => setTipoUsuario(e.target.value)}
                    >
                        <option value="">Seleccionar tipo de usuario</option>
                        {tiposUsuarios.map((tipo, index) => (
                            <option key={index} value={tipo}>{tipo}</option>
                        ))}
                    </select>

                    {tipoUsuario === "alumno" && (
                        <>
                            <select
                                className="w-full p-2 border border-blue-400 rounded-lg bg-white"
                                value={curso}
                                onChange={(e) => setCurso(e.target.value)}
                            >
                                <option value="">Seleccionar curso</option>
                                {cursos.map((c, index) => (
                                    <option key={index} value={c}>{c}</option>
                                ))}
                            </select>

                            <select
                                className="w-full p-2 border border-blue-400 rounded-lg bg-white"
                                value={modalidad}
                                onChange={(e) => setModalidad(e.target.value)}
                            >
                                <option value="">Seleccionar modalidad</option>
                                {modalidades.map((mod, index) => (
                                    <option key={index} value={mod}>{mod}</option>
                                ))}
                            </select>
                            <select
                                className="w-full p-2 border border-blue-400 rounded-lg bg-white"
                                value={tipoTitulacion}
                                onChange={(e) => setTipoTitulacion(e.target.value)}
                            >
                                <option value="">Seleccionar tipo titulación</option>
                                {tiposTitulacion.map((mod, index) => (
                                    <option key={index} value={mod}>{mod}</option>
                                ))}
                            </select>
                            {tipoTitulacion && (
                                <select className="w-full p-2 border rounded-md text-gray-800" value={titulacion} onChange={(e) => setTitulacion(e.target.value)}>
                                    <option value="">Seleccionar titulación</option>
                                    {titulaciones[tipoTitulacion]?.map((tit, index) => (
                                        <option key={index} value={tit}>{tit}</option>
                                    ))}
                                </select>
                            )}
                        </>
                    )}

                    {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
                        <select
                            className="w-full p-2 border border-blue-400 rounded-lg bg-white"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                        >
                            <option value="">Seleccionar cargo</option>
                            {cargos.map((c, index) => (
                                <option key={index} value={c}>{c}</option>
                            ))}
                        </select>
                    )}

                    {tipoUsuario === "profesor" && (
                        <select
                            className="w-full p-2 border border-blue-400 rounded-lg bg-white"
                            value={departamento}
                            onChange={(e) => setDepartamento(e.target.value)}
                        >
                            <option value="">Seleccionar departamento</option>
                            {departamentos.map((d, index) => (
                                <option key={index} value={d}>{d}</option>
                            ))}
                        </select>
                    )}
                </div>
                <button
                    className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-700 transition"
                    onClick={handleFilter}
                >
                    Buscar
                </button>
            </div>

            {/* Buscador por nombre y apellidos */}
            {people.length > 0 && (
                <div className="p-4 bg-blue-100 rounded-xl shadow-md mb-6">
                    <div className="flex items-center mb-2">
                        <label className="mr-2 font-semibold text-blue-800">Buscar por nombre o apellidos:</label>
                        <input
                            type="text"
                            className="flex-grow p-2 border border-blue-400 rounded-lg bg-white"
                            placeholder="Escribe un nombre o apellido..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <p className="text-sm text-blue-600">
                        {filteredPeople.length} {filteredPeople.length === 1 ? 'persona encontrada' : 'personas encontradas'}
                    </p>
                </div>
            )}

            {filteredPeople.length > 0 && (
                <table className="w-full border-collapse border border-blue-300 mb-6">
                    <thead>
                        <tr className="bg-blue-200">
                            <th className="border p-2">
                                <button
                                    className="text-blue-600"
                                    onClick={handleSelectAll}
                                >
                                    {filteredPeople.every(person => isPersonSelected(person)) ? "Deseleccionar todo" : "Seleccionar todo"}
                                </button>
                            </th>
                            <th className="border p-2">Nombre</th>
                            <th className="border p-2">Apellidos</th>
                            {tipoUsuario === "alumno" && <th className="border p-2">Tipo Titulación</th>}
                            {tipoUsuario === "alumno" && <th className="border p-2">Titulación</th>}
                            {tipoUsuario === "profesor" && <th className="border p-2">Departamento</th>}
                            {tipoUsuario !== "alumno" && <th className="border p-2">Cargo</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPeople.map((person, index) => (
                            <tr key={index} className="border hover:bg-blue-100">
                                <td className="border p-2">
                                    <input 
                                        type="checkbox" 
                                        checked={isPersonSelected(person)} 
                                        onChange={() => handleSelectPerson(person)} 
                                    />
                                </td>
                                <td className="border p-2">{person.nombre}</td>
                                <td className="border p-2">{person.apellidos}</td>
                                {tipoUsuario === "alumno" && <td className="border p-2">{person.tipoTitulacion}</td>}
                                {tipoUsuario === "alumno" && <td className="border p-2">{person.titulacion}</td>}
                                {tipoUsuario === "profesor" && <td className="border p-2">{person.departamento}</td>}
                                {tipoUsuario !== "alumno" && <td className="border p-2">{person.cargo}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                onClick={handleNext}
                disabled={selectedPeople.length === 0}
            >
                Siguiente
            </button>
        </div>
    );
    
}