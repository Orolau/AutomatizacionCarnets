"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

const EtiquetaEnvio = () => {
  const [carnets, setCarnets] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

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

  const generarEtiquetaPDF = () => {
    if (!seleccionado) return;

    const doc = new jsPDF();
    const fechaActual = new Date().toLocaleDateString("es-ES");
    const referencia = `REF-${Math.floor(Math.random() * 100000)}`;

    doc.setFont("helvetica", "bold");
    doc.text("ENVÍO A:", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${seleccionado.nombre} ${seleccionado.apellidos}`, 20, 30);
    doc.text(`Dirección: ${seleccionado.direccion}`, 20, 40);
    doc.text(`Población: _____________________`, 20, 50);
    doc.text(`Código Postal: _______ Provincia: ____________`, 20, 60);
    doc.text(`Nº Bultos: 1    Envío por: U-tad`, 20, 70);
    doc.text(`Peso kgs.: 0.3    Fecha: ${fechaActual}    Ref.: ${referencia}`, 20, 80);
    doc.text("REMITE: Universidad U-tad", 20, 100);

    doc.save("etiqueta_envio.pdf");
  };

  return (
    <div className="bg-[#d7e7ff] min-h-screen p-6 rounded-2xl">
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-gray-900">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-2"></th>
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
            {carnets.map((carnet) => (
              <tr key={carnet._id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={seleccionado?._id === carnet._id}
                    onChange={() => setSeleccionado(carnet)}
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
                <td className="px-4 py-2">
                  <button
                    onClick={generarEtiquetaPDF}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {carnets.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No hay carnets en modalidad online.</p>
        )}
      </div>
    </div>
  );
};

export default EtiquetaEnvio;
