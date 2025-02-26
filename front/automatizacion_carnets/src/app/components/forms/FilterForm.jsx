import { useState, useEffect } from "react";

const API_URL = "http://localhost:3005/api/person";
const FILTER_URL = "http://localhost:3005/api/person/filtered";

const FilterForm = ({ onFilter }) => {
  const [tipo, setTipo] = useState("");
  const [tipoTitulacion, setTipoTitulacion] = useState("");
  const [titulacion, setTitulacion] = useState("");
  const [curso, setCurso] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargo, setCargo] = useState("");

  const [tiposTitulacion, setTiposTitulacion] = useState([]);
  const [titulaciones, setTitulaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [filteredTitulaciones, setFilteredTitulaciones] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const tiposTitulacionUnicos = [...new Set(data.map((p) => p.tipoTitulacion).filter(Boolean))];

        const titulacionesUnicas = data.reduce((acc, p) => {
          if (p.tipoTitulacion && p.titulacion) {
            if (!acc[p.tipoTitulacion]) acc[p.tipoTitulacion] = [];
            acc[p.tipoTitulacion].push(p.titulacion);
          }
          return acc;
        }, {});

        const cursosUnicos = [...new Set(data.map((p) => p.curso).filter(Boolean))];
        const departamentosUnicos = [...new Set(data.map((p) => p.departamento).filter(Boolean))];
        const cargosUnicos = [...new Set(data.map((p) => p.cargo).filter(Boolean))];

        setTiposTitulacion(tiposTitulacionUnicos);
        setTitulaciones(titulacionesUnicas);
        setCursos(cursosUnicos);
        setDepartamentos(departamentosUnicos);
        setCargos(cargosUnicos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tipoTitulacion && titulaciones[tipoTitulacion]) {
      setFilteredTitulaciones([...new Set(titulaciones[tipoTitulacion])]);
    } else {
      setFilteredTitulaciones([]);
    }
    setTitulacion("");
  }, [tipoTitulacion]);

  const handleFilter = async () => {
    try {
      const queryParams = new URLSearchParams({
        tipoUsuario: tipo || "",
        tipoTitulacion: tipoTitulacion || "",
        titulacion: titulacion || "",
        curso: curso || "",
        departamento: departamento || "",
        cargo: cargo || "",
      });

      console.log("Enviando filtros a la API:", queryParams.toString());

      const response = await fetch(`${FILTER_URL}?${queryParams}`);
      const data = await response.json();

      console.log("Respuesta de la API:", data);

      setFilteredPeople(Array.isArray(data) ? data : []);

      if (typeof onFilter === "function") {
        onFilter(data);
      }
    } catch (error) {
      console.error("Error fetching filtered people:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Filtrado de carnets</h1>

      <select className="w-full p-2 border rounded-md text-gray-800" value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="">Seleccionar tipo</option>
        <option value="alumno">Alumno</option>
        <option value="profesor">Profesor</option>
        <option value="personal">Personal</option>
      </select>

      {tipo === "alumno" && (
        <>
          <select className="w-full p-2 border rounded-md text-gray-800" value={tipoTitulacion} onChange={(e) => setTipoTitulacion(e.target.value)}>
            <option value="">Seleccionar tipo de titulación</option>
            {tiposTitulacion.map((tt, index) => (
              <option key={index} value={tt}>{tt}</option>
            ))}
          </select>

          <select className="w-full p-2 border rounded-md text-gray-800" value={titulacion} onChange={(e) => setTitulacion(e.target.value)} disabled={!tipoTitulacion}>
            <option value="">Seleccionar titulación</option>
            {filteredTitulaciones.map((tit, index) => (
              <option key={index} value={tit}>{tit}</option>
            ))}
          </select>

          <select className="w-full p-2 border rounded-md text-gray-800" value={curso} onChange={(e) => setCurso(e.target.value)}>
            <option value="">Seleccionar curso</option>
            {cursos.map((cur, index) => (
              <option key={index} value={cur}>{cur}</option>
            ))}
          </select>
        </>
      )}

      {tipo === "profesor" && (
        <select className="w-full p-2 border rounded-md text-gray-800" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
          <option value="">Seleccionar departamento</option>
          {departamentos.map((dep, index) => (
            <option key={index} value={dep}>{dep}</option>
          ))}
        </select>
      )}

      {tipo === "personal" && (
        <select className="w-full p-2 border rounded-md text-gray-800" value={cargo} onChange={(e) => setCargo(e.target.value)}>
          <option value="">Seleccionar cargo</option>
          {cargos.map((c, index) => (
            <option key={index} value={c}>{c}</option>
          ))}
        </select>
      )}

      <button className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600" onClick={handleFilter}>
        Buscar
      </button>

      <ul className="mt-4">
        {filteredPeople.length > 0 ? (
          filteredPeople.map((p) => (
            <li key={p._id} className="p-2 border-b text-gray-800">
              {p.nombre} {p.apellidos}
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-800">No se encontraron resultados.</li>
        )}
      </ul>
    </div>
  );
};

export default FilterForm;
