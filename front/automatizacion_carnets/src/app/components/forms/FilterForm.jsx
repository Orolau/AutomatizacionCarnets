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
  const [modalidad, setModalidad] = useState("");

  const [tiposUsuarios, setTiposUsuarios] = useState([]);
  const [tiposTitulacion, setTiposTitulacion] = useState([]);
  const [titulaciones, setTitulaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [modalidades, setModalidades] = useState([]);

  // Estado para los resultados filtrados
  const [resultados, setResultados] = useState([]);

  const tokenLogin = localStorage.getItem('tokenLogin');

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
    if (modalidad) params.append("modalidad", modalidad);

    try {
      const response = await fetch(`${FILTER_URL}?${params.toString()}`);
      const data = await response.json();
      // Almacenar los resultados en el estado
      setResultados(data);
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

      <select className="w-full p-2 border rounded-md text-gray-800" value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
        <option value="">Seleccionar modalidad</option>
        {modalidades.map((mod, index) => (
          <option key={index} value={mod}>{mod}</option>
        ))}
      </select>

      <button className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600" onClick={handleFilter}>
        Buscar
      </button>

      {/* Mostrar los resultados filtrados */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800">Resultados:</h2>
        <div className="mt-4">
          {resultados.length > 0 ? (
            resultados.map((persona, index) => (
              <div key={index} className="p-4 bg-gray-100 mb-4 rounded-lg">
                <h3 className="font-semibold text-lg">{persona.nombre}</h3>
                <p><strong>Tipo de Usuario:</strong> {persona.tipoUsuario}</p>
                {persona.tipoUsuario === "alumno" && (
                  <>
                    <p><strong>Titulación:</strong> {persona.titulacion}</p>
                    <p><strong>Curso:</strong> {persona.curso}</p>
                  </>
                )}
                {persona.tipoUsuario === "profesor" && (
                  <>
                    <p><strong>Cargo:</strong> {persona.cargo}</p>
                    <p><strong>Departamento:</strong> {persona.departamento}</p>
                  </>
                )}
                {persona.tipoUsuario === "personal" && (
                  <p><strong>Cargo:</strong> {persona.cargo}</p>
                )}
                <p><strong>Modalidad:</strong> {persona.modalidad}</p>
              </div>
            ))
          ) : (
            <p>No se han encontrado resultados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterForm;
