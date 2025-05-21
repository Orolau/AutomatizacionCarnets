"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PendingCardList() {
  const [carnetsConError, setCarnetsConError] = useState([]);
  const [selectedDNI, setSelectedDNI] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("filteredPeople");
    if (!raw) return;
    let personas = [];
    try {
      personas = JSON.parse(raw);
    } catch (_) {
      console.error("JSON malformado en filteredPeople");
      return;
    }
    const conErrores = personas.reduce((acc, persona) => {
      const foto = (persona.foto || "").trim();
      const dni = (persona.dni || "").trim();
      const nombre = (persona.nombre || "").trim();
      const apellidos = (persona.apellidos || "").trim();
      // Validar nombre y apellidos: solo letras y espacios
      const textoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
      let errorMsg = null;
      if (!foto) {
        errorMsg = "Falta imagen";
      } else if (!dni || dni.length !== 9) {
        errorMsg = "DNI ilegible";
      } else if (!nombre || !textoRegex.test(nombre)) {
        errorMsg = "Nombre inválido";
      } else if (!apellidos || !textoRegex.test(apellidos)) {
        errorMsg = "Apellidos inválidos";
      }

      if (errorMsg) {
        acc.push({ ...persona, error: errorMsg });
      }
      return acc;
    }, []);
    setCarnetsConError(conErrores);
  }, []);

  const handleEdit = (dni) => {
    router.push(`/pages/modify/edit?dni=${dni}`);
  };

  const isSelected = (dni) => selectedDNI.includes(dni);

  const toggleSelection = (dni) => {
    setSelectedDNI((prev) =>
      prev.includes(dni) ? prev.filter((d) => d !== dni) : [...prev, dni]
    );
  };

  const toggleSelectAll = () => {
    if (carnetsConError.every((c) => selectedDNI.includes(c.dni))) {
      setSelectedDNI([]);
    } else {
      setSelectedDNI(carnetsConError.map((c) => c.dni));
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[500px] overflow-y-auto">
        <table className="min-w-full text-sm text-left divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Titulación</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Error</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {carnetsConError.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No hay carnets pendientes por fallo.
                </td>
              </tr>
            ) : (
              carnetsConError.map((carnet) => (
                <tr
                  key={carnet.dni}
                  onClick={() => toggleSelection(carnet.dni)}
                  className={`transition-all duration-200 ease-in-out rounded-md cursor-pointer ${isSelected(carnet.dni)
                    ? "bg-blue-50"
                    : "hover:bg-gray-50 hover:scale-[1.01] hover:shadow-md"
                    }`}
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <div className="ml-5 w-3 h-3 rounded-full bg-red-500"></div>
                  </td>
                  <td className="px-4 py-2 text-gray-800 font-medium whitespace-nowrap">
                    {carnet.nombre} {carnet.apellidos}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {carnet.titulacion || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{carnet.curso || "-"}</td>
                  <td className="px-4 py-2 font-semibold text-red-500">
                    {carnet.error}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(carnet.dni);
                      }}
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
