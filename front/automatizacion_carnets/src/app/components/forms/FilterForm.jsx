import { useState, useEffect } from "react";

const API_URL = "http://localhost:3005/api/person";
const FILTER_URL = "http://localhost:3005/api/person/filtered";

const FilterForm = ({ onFilter }) => {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [tipoTitulacion, setTipoTitulacion] = useState("");
  const [titulacion, setTitulacion] = useState("");
  const [curso, setCurso] = useState("");
  const [cargo, setCargo] = useState("");
  const [departamento, setDepartamento] = useState("");

  const [tiposUsuarios, setTiposUsuarios] = useState([]);
  const [tiposTitulacion, setTiposTitulacion] = useState([]);
  const [titulaciones, setTitulaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

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

        const titulacionesAgrupadas = data.reduce((acc, p) => {
          if (p.tipoTitulacion && p.titulacion) {
            if (!acc[p.tipoTitulacion]) acc[p.tipoTitulacion] = [];
            acc[p.tipoTitulacion].push(p.titulacion);
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

  useEffect(() => {
    if (!tipoTitulacion) setTitulacion("");
  }, [tipoTitulacion]);

  const handleFilter = async () => {
    const params = new URLSearchParams();
    if (tipoUsuario) params.append("tipoUsuario", tipoUsuario);
    if (tipoTitulacion) params.append("tipoTitulacion", tipoTitulacion);
    if (titulacion) params.append("titulacion", titulacion);
    if (curso) params.append("curso", curso);
    if (cargo) params.append("cargo", cargo);
    if (departamento) params.append("departamento", departamento);

    try {
      const response = await fetch(`${FILTER_URL}?${params.toString()}`);
      const data = await response.json();
      if (typeof onFilter === "function") onFilter(data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Filtrar Personas</h1>
      
      <select className="w-full p-2 border rounded-md text-gray-800" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
        <option value="">Seleccionar tipo de usuario</option>
        {tiposUsuarios.map((tipo, index) => (
          <option key={index} value={tipo}>{tipo}</option>
        ))}
      </select>

      {tipoUsuario === "alumno" && (
        <>
          <select className="w-full p-2 border rounded-md text-gray-800" value={tipoTitulacion} onChange={(e) => setTipoTitulacion(e.target.value)}>
            <option value="">Seleccionar tipo de titulación</option>
            {tiposTitulacion.map((tt, index) => (
              <option key={index} value={tt}>{tt}</option>
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
          
          <select className="w-full p-2 border rounded-md text-gray-800" value={curso} onChange={(e) => setCurso(e.target.value)}>
            <option value="">Seleccionar curso</option>
            {cursos.map((cur, index) => (
              <option key={index} value={cur}>{cur}</option>
            ))}
          </select>
        </>
      )}

      {tipoUsuario === "profesor" && (
        <>
          <select className="w-full p-2 border rounded-md text-gray-800" value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="">Seleccionar cargo</option>
            {cargos.map((c, index) => (
              <option key={index} value={c}>{c}</option>
            ))}
          </select>
          
          <select className="w-full p-2 border rounded-md text-gray-800" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
            <option value="">Seleccionar departamento</option>
            {departamentos.map((dep, index) => (
              <option key={index} value={dep}>{dep}</option>
            ))}
          </select>
        </>
      )}

      {tipoUsuario === "personal" && (
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
    </div>
  );
};

export default FilterForm;
