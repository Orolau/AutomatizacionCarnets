import { useState } from "react";

export default function PersonalDataFiltered ({ filters, people, setSelectedPeople, setFilters }) {
  const [localSelected, setLocalSelected] = useState([]);

  const titulaciones = {
    grado: [
      "Grado de Diseño de Videojuegos",
      "Grado de Ingeniería de Videojuegos",
      "Grado de Arte para Videojuegos",
      "Grado de Ilustración y Desarrollo Visual",
      "Grado de Dirección de Empresas de Entretenimiento Digital",
      "Grado de Efectos Visuales",
      "Grado de Animación",
      "Grado de Diseño Digital",
      "Grado de Ingeniería del Software",
      "Doble grado de Ingeniería del Software y Matemática Computacional",
      "Doble grado de Ingeniería del Software y Física Computacional"
    ],
    ciclo: [
      "Curso de Especialización en Ciberseguridad en Entornos de las Tecnologías de la Información",
      "Curso de Especialización en Desarrollo de Videojuegos y Realidad Virtual",
      "Ciclo de Grado Superior en Artes Plásticas y Diseño en Animación",
      "Ciclo de Grado Superior en Artes Plásticas y Diseño en Ilustración",
      "Ciclo de Grado Superior en Desarrollo de Aplicaciones Multiplataforma",
      "Ciclo de Grado Superior en Desarrollo de Aplicaciones Web",
      "Ciclo de Grado Superior en Administración de Sistemas Informáticos en Red",
      "Ciclo de Grado Superior en Desarrollo de Aplicaciones Multiplataforma en Régimen Intensivo (DUAL)",
      "Ciclo de Grado Superior en Animaciones 3D, Juegos y Entornos Interactivos"
    ],
    master: [
      "Máster Universitario en Tecnologías Digitales para el Arte",
      "Máster Universitario en Computación Gráfica, Realidad Virtual y Simulación",
      "Máster Universitario en Producción de Animación, Efectos Visuales y Videojuegos"
    ]
  };

  const handleSelect = (dni) => {
    const updatedSelection = localSelected.includes(dni)
      ? localSelected.filter((id) => id !== dni)
      : [...localSelected, dni];
    setLocalSelected(updatedSelection);
    setSelectedPeople(updatedSelection);
  };

  const handleSelectAll = () => {
    if (localSelected.length === people.length) {
      setLocalSelected([]);
      setSelectedPeople([]);
    } else {
      const allDnis = people.map((person) => person.dni);
      setLocalSelected(allDnis);
      setSelectedPeople(allDnis);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="p-4 bg-white text-black">
      <div className="mb-4 p-4 bg-blue-100 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700">Filtros</h2>
        <form className="flex flex-row flex-wrap gap-4">
          <div>
            <label className="block text-blue-700">Curso</label>
            <input type="text" name="curso" value={filters.curso} onChange={handleFilterChange} className="w-16 p-2 border border-blue-300 rounded" />
          </div>
          <div>
            <label className="block text-blue-700">Grupo</label>
            <input type="text" name="grupo" value={filters.grupo} onChange={handleFilterChange} className="w-16 p-2 border border-blue-300 rounded" />
          </div>
          <div>
            <label className="block text-blue-700">Tipo de Titulación</label>
            <select name="tipoTitulacion" value={filters.tipoTitulacion} onChange={handleFilterChange} className="w-full p-2 border border-blue-300 rounded">
              <option value="">Seleccione...</option>
              <option value="grado">Grado</option>
              <option value="ciclo">Ciclo Formativo</option>
              <option value="master">Máster Universitario</option>
            </select>
          </div>
          <div>
            <label className="block text-blue-700">Titulación</label>
            <select name="titulacion" value={filters.titulacion} onChange={handleFilterChange} className="w-full p-2 border border-blue-300 rounded">
              <option value="">Seleccione...</option>
              {(titulaciones[filters.tipoTitulacion] || []).map((titulacion) => (
                <option key={titulacion} value={titulacion}>{titulacion}</option>
              ))}
            </select>
          </div>
          <button type="button" className="col-span-3 bg-blue-500 text-white p-2 rounded-lg">Aplicar Filtros</button>
        </form>
      </div>
      <button 
        onClick={handleSelectAll} 
        className="mb-2 p-2 bg-blue-500 text-white rounded-lg">
        {localSelected.length === people.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
      </button>
      <table className="w-full border-collapse border border-blue-300">
        <thead>
          <tr className="bg-blue-200">
            <th className="border p-1"></th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Apellidos</th>
            <th className="border p-1">Curso</th>
            <th className="border p-2">Titulación</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr 
              key={person.dni} 
              className="border hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(person.dni)} // Al hacer click en la fila
            >
              <td className="border p-1 text-center">
                <input
                  type="checkbox"
                  checked={localSelected.includes(person.dni)}
                  onChange={(e) => e.stopPropagation()} // Evita que el clic en el checkbox active la fila
                />
              </td>
              <td className="border p-2">{person.nombre}</td>
              <td className="border p-2">{person.apellidos}</td>
              <td className="border p-1">{person.curso || "-"}</td>
              <td className="border p-2">{person.titulacion || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-blue-700 font-semibold">
        {localSelected.length} personas seleccionadas de {people.length}
      </div>
      <button className="mt-4 p-2 bg-blue-500 text-white rounded-lg">Siguiente</button>
    </div>
  );
};