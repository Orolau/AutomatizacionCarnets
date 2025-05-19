"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { fetchOnlinePeople } from "@/app/api/api";

const EtiquetaEnvio = () => {
  const [carnets, setCarnets] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchOnlinePeople()
      .then(setCarnets)
      .catch(error => console.error("Error al obtener los carnets: ", error));
  }, []);


  const toggleSeleccion = (persona) => {
    if (seleccionados.some(sel => sel._id === persona._id)) {
      setSeleccionados(seleccionados.filter(sel => sel._id !== persona._id));
    } else {
      setSeleccionados([...seleccionados, persona]);
    }
  };

  const seleccionarTodo = () => {
    if (seleccionados.length === carnetsFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(carnetsFiltrados);
    }
  };

  const generarPDF = (persona) => {
    const doc = new jsPDF();
    const fechaActual = new Date().toLocaleDateString("es-ES");
    const referencia = `REF-${Math.floor(Math.random() * 100000)}`;

    doc.setFont("helvetica", "bold");
    doc.text("ENVÍO A:", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${persona.nombre} ${persona.apellidos}`, 20, 30);
    doc.text(`Dirección: ${persona.direccion}`, 20, 40);
    doc.text(`Población: _____________________`, 20, 50);
    doc.text(`Código Postal: _______ Provincia: ____________`, 20, 60);
    doc.text(`Nº Bultos: 1    Envío por: U-tad`, 20, 70);
    doc.text(`Peso kgs.: 0.3    Fecha: ${fechaActual}    Ref.: ${referencia}`, 20, 80);
    doc.text("REMITE: Universidad U-tad", 20, 100);

    return doc.output("blob");
  };

  const imprimirSeleccionados = async () => {
    if (seleccionados.length === 0) return;
    if (seleccionados.length === 1) {
      const pdfBlob = await generarPDF(seleccionados[0]);
      saveAs(pdfBlob, "etiqueta_envio.pdf");
    } else {
      const zip = new JSZip();
      for (const persona of seleccionados) {
        const blob = await generarPDF(persona);
        const nombreArchivo = `${persona.nombre}_${persona.apellidos}.pdf`;
        zip.file(nombreArchivo, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "etiquetas_envio.zip");
    }
  };

  const carnetsFiltrados = carnets
    .filter(persona => {
      const fullName = `${persona.nombre} ${persona.apellidos}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField]?.toString().toLowerCase() || "";
      const valB = b[sortField]?.toString().toLowerCase() || "";
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-2xl shadow-md w-full h-full p-6">
        {/* Buscador + imprimir */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar persona"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full"
          />
          <button
            onClick={imprimirSeleccionados}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
          >
            <img src="/images/print_icon.png" alt="Imprimir" className="w-4 h-4" />
            Descargar etiquetas
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-scroll border border-gray-200 rounded-xl">
          <table className="min-w-full text-sm text-gray-900">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2">
                  <button
                    onClick={seleccionarTodo}
                    className="text-[#0065ef] hover:underline font-semibold text-sm"
                  >
                    {seleccionados.length === carnetsFiltrados.length ? "Deseleccionar todo" : "Seleccionar todo"}
                  </button>
                </th>
                {["nombre", "apellidos", "titulacion", "cargo", "dni", "direccion", "correo"].map((field, i) => (
                  <th
                    key={i}
                    onClick={() => handleSort(field)}
                    className="px-4 py-2 cursor-pointer select-none hover:underline text-gray-700"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (sortDirection === "asc" ? " ▲" : " ▼")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {carnetsFiltrados.map((carnet) => (
                <tr
                  key={carnet._id}
                  onClick={() => toggleSeleccion(carnet)}
                  className="hover:bg-gray-50 hover:scale-[1.01] hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer"
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={seleccionados.some(sel => sel._id === carnet._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSeleccion(carnet);
                        }}
                      />
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{carnet.nombre}</td>
                  <td className="px-4 py-2">{carnet.apellidos}</td>
                  <td className="px-4 py-2">{carnet.titulacion}</td>
                  <td className="px-4 py-2">{carnet.cargo}</td>
                  <td className="px-4 py-2">{carnet.dni}</td>
                  <td className="px-4 py-2">{carnet.direccion}</td>
                  <td className="px-4 py-2">{carnet.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {carnetsFiltrados.length === 0 && (
          <div className="text-center text-gray-500 mt-10 min-h-[300px]">
            <img src="/images/flecha.png" className="mx-auto mb-4 w-[150px]" alt="Flecha" />
            <p className="text-xl font-semibold">No hay carnets en modalidad online.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EtiquetaEnvio;
