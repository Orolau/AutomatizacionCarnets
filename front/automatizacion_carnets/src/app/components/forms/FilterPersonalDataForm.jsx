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
        <div className="p-4 bg-[#E6F0FF] min-h-screen">
            {/* Cabecera con fondo azul */}
            <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg">
                <div className="flex items-center space-x-4">
                    <img src="logo.png" alt="Logo" className="h-8" />
                    <h2 className="text-xl font-semibold text-[#003366]">Principal</h2>
                </div>
                <div className="flex space-x-6 text-[#003366] font-medium">
                    <p>🚨 Pendientes/Error</p>
                    <p>✉️ Etiquetas de Envío</p>
                </div>
                <div className="rounded-full bg-gray-200 p-2">
                    <span className="text-gray-600">👤</span>
                </div>
            </div>
    
            {/* Barra de búsqueda */}
            <div className="bg-white p-4 shadow-md mt-6 rounded-lg">
                <input 
                    type="text"
                    placeholder="Buscar persona"
                    className="w-full p-3 border rounded-md text-gray-800 shadow-sm focus:ring focus:ring-blue-300"
                />
            </div>
    
            {/* Filtros */}
            <div className="bg-white p-4 mt-4 shadow-md rounded-lg flex space-x-4">
                <select className="w-1/4 p-3 border rounded-lg bg-gray-100">
                    <option>Profesor</option>
                </select>
                <select className="w-1/4 p-3 border rounded-lg bg-gray-100">
                    <option>Profesor</option>
                </select>
                <select className="w-1/4 p-3 border rounded-lg bg-gray-100">
                    <option>Seleccionar departamento</option>
                </select>
                <button className="w-1/4 bg-[#007BFF] text-white p-3 rounded-lg hover:bg-blue-600 transition">
                    Buscar
                </button>
            </div>
    
            {/* Tabla de datos */}
            <div className="bg-white p-4 mt-4 shadow-md rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#F0F8FF] text-gray-700">
                            <th className="p-3 border">✔️</th>
                            <th className="p-3 border">Estado</th>
                            <th className="p-3 border">Nombre</th>
                            <th className="p-3 border">Apellidos</th>
                            <th className="p-3 border">Departamento</th>
                            <th className="p-3 border">Cargo</th>
                            <th className="p-3 border">ID</th>
                            <th className="p-3 border">Materia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(8)].map((_, index) => (
                            <tr key={index} className="border hover:bg-gray-100">
                                <td className="p-3 border text-center">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3 border text-center">
                                    <span className={`inline-block w-4 h-4 rounded-full ${
                                        index % 3 === 0 ? "bg-green-500" :
                                        index % 3 === 1 ? "bg-red-500" :
                                        "bg-blue-500"
                                    }`}></span>
                                </td>
                                <td className="p-3 border">Antonio</td>
                                <td className="p-3 border">Ruiz Navarro</td>
                                <td className="p-3 border">Ciberseguridad</td>
                                <td className="p-3 border">Profesor</td>
                                <td className="p-3 border">51141604E</td>
                                <td className="p-3 border">{index % 2 === 0 ? "Física" : "Online"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
}