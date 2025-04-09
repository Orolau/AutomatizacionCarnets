"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import personasData from "@/app/jsonPruebas/personasFiltrado.json";

export default function PendingCardList() {
  const [carnets, setCarnets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const obtenerCarnetsFallidos = () => {
      const carnetsConErrores = personasData
        .filter((persona) => persona.tipo === "estudiante")
        .filter((persona) => !persona.imagen?.trim() || !persona.dni?.trim())
        .map((persona) => ({
          ...persona,
          error: !persona.imagen?.trim() ? "Falta imagen" : "DNI ilegible",
        }));
      setCarnets(carnetsConErrores);
    };

    obtenerCarnetsFallidos();
  }, []);

  const handleEdit = (dni) => {
    router.push(`/pages/userForms/edit?dni=${dni}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#0d1b2a] mb-6">
        Carnets con errores
      </h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-4 w-10"></th>
              <th className="p-4 w-10"></th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Titulación</th>
              <th className="p-4">Curso</th>
              <th className="p-4">Error</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {carnets.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-400">
                  No hay carnets pendientes por fallo.
                </td>
              </tr>
            ) : (
              carnets.map((carnet) => (
                <tr
                  key={carnet.dni}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Checkbox visual */}
                  <td className="p-4">
                    <input type="checkbox" className="accent-blue-600" />
                  </td>

                  {/* Punto rojo */}
                  <td className="p-4">
                    <span className="block w-3 h-3 bg-red-500 rounded-full"></span>
                  </td>

                  {/* Datos */}
                  <td className="p-4 text-gray-800 font-medium whitespace-nowrap">
                    {carnet.nombre} {carnet.apellidos}
                  </td>
                  <td className="p-4 text-gray-700">{carnet.titulacion}</td>
                  <td className="p-4 text-gray-700">{carnet.curso}</td>
                  <td className="p-4 font-semibold text-red-500">
                    {carnet.error}
                  </td>

                  {/* Botón editar */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleEdit(carnet.dni)}
                      className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
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