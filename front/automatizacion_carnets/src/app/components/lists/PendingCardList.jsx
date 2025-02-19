"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import personasData from "@/app/jsonPruebas/personasFiltrado.json";

export default function PendingCardsList() {
  const [carnets, setCarnets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const obtenerCarnetsFallidos = () => {
      console.log("JSON cargado correctamente:", personasData);

      const carnetsConErrores = personasData
        .filter((persona) => persona.tipo === "estudiante") // Solo estudiantes
        .filter((persona) => !persona.imagen?.trim() || !persona.dni?.trim()) // Detecta imágenes o DNIs vacíos
        .map((persona) => ({
          ...persona,
          error: !persona.imagen?.trim() ? "Falta imagen" : "DNI ilegible",
        }));

      console.log("Carnets detectados con errores:", carnetsConErrores);
      setCarnets(carnetsConErrores);
    };

    obtenerCarnetsFallidos();
  }, []);

  const handleEdit = (dni) => {
    router.push(`/pages/userForms/edit?dni=${dni}`); // Redirige a la Página 8 para editar
  };

  return (
    <div className="table-container">
      <div>
        <h2 className="text-xl font-bold mb-4 text-black text-center">
          Carnets con Errores
        </h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Titulación</th>
              <th className="py-2 px-4 border">Curso</th>
              <th className="py-2 px-4 border">Error</th>
              <th className="py-2 px-4 border">Acción</th>
            </tr>
          </thead>
          <tbody>
            {carnets.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No hay carnets pendientes por fallo.
                </td>
              </tr>
            ) : (
              carnets.map((carnet) => (
                <tr key={carnet.dni} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 border text-black font-medium">
                    {carnet.nombre} {carnet.apellidos}
                  </td>
                  <td className="py-2 px-4 border text-black font-medium">
                    {carnet.titulacion}
                  </td>
                  <td className="py-2 px-4 border text-black font-medium">
                    {carnet.curso}
                  </td>
                  <td className="py-2 px-4 border text-red-500 font-bold">
                    {carnet.error}
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleEdit(carnet.dni)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
