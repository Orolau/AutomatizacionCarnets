import { useState, useEffect } from "react";

const FilterForm = ({ onFilter }) => {
  const [tipo, setTipo] = useState("");
  const [tipoTitulacion, setTipoTitulacion] = useState("");
  const [titulacion, setTitulacion] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargo, setCargo] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposTitulacion, setTiposTitulacion] = useState([]);
  const [titulaciones, setTitulaciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    fetch("/api/person/filtered")
      .then((res) => res.json())
      .then((data) => {
        const people = data || [];
        setTipos([...new Set(people.map((p) => p.tipoUsuario))]);
        setDepartamentos([...new Set(people.map((p) => p.departamento).filter(Boolean))]);
        setCargos([...new Set(people.map((p) => p.cargo).filter(Boolean))]);
      })
      .catch((err) => console.error("Error fetching people:", err));
  }, []);

  useEffect(() => {
    if (tipo === "alumno") {
      fetch("/api/person/filtered")
        .then((res) => res.json())
        .then((data) => {
          const students = data.filter((p) => p.tipoUsuario === "alumno");
          setTiposTitulacion([...new Set(students.map((p) => p.tipoTitulacion))]);
        })
        .catch((err) => console.error("Error fetching students:", err));
    }
  }, [tipo]);

  useEffect(() => {
    if (tipoTitulacion) {
      fetch("/api/person/filtered")
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter(
            (p) => p.tipoUsuario === "alumno" && p.tipoTitulacion === tipoTitulacion
          );
          setTitulaciones([...new Set(filtered.map((p) => p.titulacion))]);
        })
        .catch((err) => console.error("Error fetching titulaciones:", err));
    }
  }, [tipoTitulacion]);

  const handleFilter = () => {
    let query = "/api/person/filtered?";
    if (tipo) query += `tipoUsuario=${tipo}&`;
    if (tipoTitulacion) query += `tipoTitulacion=${tipoTitulacion}&`;
    if (titulacion) query += `titulacion=${titulacion}&`;
    if (departamento) query += `departamento=${departamento}&`;
    if (cargo) query += `cargo=${cargo}`;

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        setFilteredPeople(data);
        if (typeof onFilter === "function") {
          onFilter(data);
        }
      })
      .catch((err) => console.error("Error fetching filtered data:", err));
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

      {tipo === "alumno" && (
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
        </>
      )}

      {tipo === "profesor" && (
        <select className="w-full p-2 border rounded-md text-gray-800" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
          <option value="">Seleccionar departamento</option>
          {departamentos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      )}

      {tipo === "personal" && (
        <select className="w-full p-2 border rounded-md text-gray-800" value={cargo} onChange={(e) => setCargo(e.target.value)}>
          <option value="">Seleccionar cargo</option>
          {cargos.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}

      <button className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600" onClick={handleFilter}>
        Buscar
      </button>

      <ul className="mt-4">
        {filteredPeople.map((p) => (
          <li key={p.dni} className="p-2 border-b text-gray-800">
            {p.nombre} {p.apellidos}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterForm;
