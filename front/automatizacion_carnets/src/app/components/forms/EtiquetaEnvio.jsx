"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const EtiquetaEnvio = () => {
  const [carnets, setCarnets] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3005/api/person")
      .then(response => {
        const onlineCarnets = response.data.filter(persona => persona.modalidad === "Online");
        setCarnets(onlineCarnets);
      })
      .catch(error => {
        console.error("Error al obtener los carnets: ", error);
      });
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

  const carnetsFiltrados = carnets.filter(persona => {
    const fullName = `${persona.nombre} ${persona.apellidos}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

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
            title="Imprimir etiquetas"
          >
            <img src="/images/print_icon.png" alt="Imprimir" className="w-6 h-6" />
          </button>
        </div>

        {/* Tabla */}
        <table className="min-w-full text-sm text-gray-900">
          <thead className="border-b bg-white">
            <tr>
              <th className="px-4 py-2">
                <button
                  onClick={seleccionarTodo}
                  className="text-[#0065ef] hover:underline text-sm"
                >
                  {seleccionados.length === carnetsFiltrados.length ? "Deseleccionar todo" : "Seleccionar todo"}
                </button>
              </th>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellidos</th>
              <th className="px-4 py-2">Titulación</th>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">DNI</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {carnetsFiltrados.map((carnet) => (
              <tr key={carnet._id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={seleccionados.some(sel => sel._id === carnet._id)}
                    onChange={() => toggleSeleccion(carnet)}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto" />
                </td>
                <td className="px-4 py-2">{carnet.nombre}</td>
                <td className="px-4 py-2">{carnet.apellidos}</td>
                <td className="px-4 py-2">{carnet.titulacion}</td>
                <td className="px-4 py-2">{carnet.cargo}</td>
                <td className="px-4 py-2">{carnet.dni}</td>
                <td className="px-4 py-2">{carnet.direccion}</td>
                <td className="px-4 py-2">{carnet.correo}</td>
                <td className="px-4 py-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {carnetsFiltrados.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No hay carnets en modalidad online.</p>
        )}
      </div>
    </div>
  );
};

export default EtiquetaEnvio;
