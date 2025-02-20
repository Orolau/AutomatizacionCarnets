import { useState } from "react";
import personas from "@/app/jsonPruebas/personasFiltrado.json";

const FilterForm = ({ onFilter }) => {
  const [tipo, setTipo] = useState("");
  const [tipoTitulacion, setTipoTitulacion] = useState("");
  const [titulacion, setTitulacion] = useState("");
  const [curso, setCurso] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargo, setCargo] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);

  const tipos = [...new Set(personas.map((p) => p.tipo))];

  const tiposTitulacion = tipo === "estudiante" ? [...new Set(personas.filter((p) => p.tipo === "estudiante").map((p) => p.tipo_titulacion))] : [];

  const titulaciones = tipoTitulacion ? [...new Set(personas.filter((p) => p.tipo === "estudiante" && p.tipo_titulacion === tipoTitulacion).map((p) => p.titulacion))] : [];

  const cursos = titulacion ? [...new Set(personas.filter((p) => p.tipo === "estudiante" && p.tipo_titulacion === tipoTitulacion && p.titulacion === titulacion).map((p) => p.curso))] : [];

  const departamentos = tipo === "docente" ? [...new Set(personas.filter((p) => p.tipo === "docente").map((p) => p.departamento))] : [];

  const cargos = tipo === "staff" ? [...new Set(personas.filter((p) => p.tipo === "staff").map((p) => p.cargo))] : [];

  const handleFilter = () => {
    let filtered = personas.filter((p) => p.tipo === tipo);

    if (tipo === "estudiante") {
      if (tipoTitulacion) filtered = filtered.filter((p) => p.tipo_titulacion === tipoTitulacion);
      if (titulacion) filtered = filtered.filter((p) => p.titulacion === titulacion);
      if (curso) filtered = filtered.filter((p) => p.curso === curso);
    }

    if (tipo === "docente" && departamento) {
      filtered = filtered.filter((p) => p.departamento === departamento);
    }

    if (tipo === "staff" && cargo) {
      filtered = filtered.filter((p) => p.cargo === cargo);
    }

    setFilteredPeople(filtered);
    if (typeof onFilter === 'function') {
      onFilter(filtered);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Filtrado de carnets</h1>
      <select className="w-full p-2 border rounded-md text-gray-800" value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="">Seleccionar tipo</option>
        {tipos.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {tipo === "estudiante" && (
        <>
          <select className="w-full p-2 border rounded-md text-gray-800" value={tipoTitulacion} onChange={(e) => setTipoTitulacion(e.target.value)}>
            <option value="">Seleccionar tipo de titulación</option>
            {tiposTitulacion.map((tt) => (
              <option key={tt} value={tt}>{tt}</option>
            ))}
          </select>

          {tipoTitulacion && (
            <select className="w-full p-2 border rounded-md text-gray-800" value={titulacion} onChange={(e) => setTitulacion(e.target.value)}>
              <option value="">Seleccionar titulación</option>
              {titulaciones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}

          {titulacion && (
            <select className="w-full p-2 border rounded-md text-gray-800" value={curso} onChange={(e) => setCurso(e.target.value)}>
              <option value="">Seleccionar curso</option>
              {cursos.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </>
      )}

      {tipo === "docente" && (
        <select className="w-full p-2 border rounded-md text-gray-800" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
          <option value="">Seleccionar departamento</option>
          {departamentos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      )}

      {tipo === "staff" && (
        <select className="w-full p-2 border rounded-md text-gray-800" value={cargo} onChange={(e) => setCargo(e.target.value)}>
          <option value="">Seleccionar cargo</option>
          {cargos.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}

      <button className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600" onClick={handleFilter}>Buscar</button>

      <ul className="mt-4">
        {filteredPeople.map((p) => (
          <li key={p.DNI} className="p-2 border-b text-gray-800">{p.nombre} {p.apellidos}</li>
        ))}
      </ul>
    </div>
  );
};

export default FilterForm;