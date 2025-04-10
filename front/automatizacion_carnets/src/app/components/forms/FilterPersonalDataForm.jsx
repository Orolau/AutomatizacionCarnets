"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import Carnet from "../Carnet";

const FILTER_URL = "http://localhost:3005/api/person/filtered";

const normalizeText = (text) => {
  if (!text) return "";
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const tiposUsuarios = ["alumno", "profesor", "personal"];
const tiposTitulacion = ["Grado", "Máster"];
const titulaciones = {
  Grado: [
    "Grado en Diseño Digital",
    "Grado en Ingeniería del Software",
    "Ingeniería de software",
    "Doble grado de Ingeniería del software y Matemáticas Computacionales",
    "Animación",
  ],
  Máster: ["Máster en Programación de Videojuegos", "Máster en Big Data"],
};
const cursos = ["1º", "2º", "3º", "4º"];
const modalidades = ["Presencial", "Online"];
const cargos = [
  "Profesor",
  "Profesor Titular",
  "Administrativo",
  "Coordinadora",
  "Coordinadora Académica",
  "Conserje",
];
const departamentos = [
  "Ciencias de la Computación",
  "Ciberseguridad",
  "Ingeniería del Software",
  "Animación",
  "Ingeniería ",
];

export default function PersonalDataFiltered() {
  const router = useRouter();
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeople, setSelectedPeople] = useState([]);

  const [tipoUsuario, setTipoUsuario] = useState("");
  const [tipoTitulacion, setTipoTitulacion] = useState("");
  const [titulacion, setTitulacion] = useState("");
  const [curso, setCurso] = useState("");
  const [cargo, setCargo] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [modalidad, setModalidad] = useState("");

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPeople(people);
    } else {
      const normalizedSearch = normalizeText(searchTerm);
      const filtered = people.filter((person) => {
        const normalizedNombre = normalizeText(person.nombre || "");
        const normalizedApellidos = normalizeText(person.apellidos || "");
        const fullName = `${normalizedNombre} ${normalizedApellidos}`;
        return (
          normalizedNombre.includes(normalizedSearch) ||
          normalizedApellidos.includes(normalizedSearch) ||
          fullName.includes(normalizedSearch)
        );
      });
      setFilteredPeople(filtered);
    }
  }, [searchTerm, people]);

  const handleFilter = async () => {
    const params = new URLSearchParams();
    if (tipoUsuario) params.append("tipoUsuario", tipoUsuario);
    if (tipoTitulacion) params.append("tipoTitulacion", tipoTitulacion);
    if (titulacion) params.append("titulacion", titulacion);
    if (curso) params.append("curso", curso);
    if (cargo) params.append("cargo", cargo);
    if (departamento) params.append("departamento", departamento);
    if (modalidad && tipoUsuario === "alumno")
      params.append("modalidad", modalidad);

    try {
      const response = await fetch(`${FILTER_URL}?${params.toString()}`);
      const data = await response.json();
      setPeople(data);
      setFilteredPeople(data);
      setSearchTerm("");
      setSelectedPeople([]);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSelectPerson = (person) => {
    setSelectedPeople((prev) => {
      const exists = prev.some((p) => p.dni === person.dni);
      return exists
        ? prev.filter((p) => p.dni !== person.dni)
        : [...prev, person];
    });
  };

  const isPersonSelected = (person) =>
    selectedPeople.some((p) => p.dni === person.dni);

  const handleSelectAll = () => {
    if (filteredPeople.every(isPersonSelected)) {
      setSelectedPeople((prev) =>
        prev.filter((p) => !filteredPeople.some((fp) => fp.dni === p.dni))
      );
    } else {
      const newSelected = [...selectedPeople];
      filteredPeople.forEach((person) => {
        if (!isPersonSelected(person)) {
          newSelected.push(person);
        }
      });
      setSelectedPeople(newSelected);
    }
  };

  const handleNext = () => {
    localStorage.setItem("selectedPeople", JSON.stringify(selectedPeople));
    if (selectedPeople.length > 0) {
      router.push("/pages/preview");
    } else {
      alert("Selecciona al menos una persona");
    }
  };

  const descargarCarnetsComoPNG = async (fondoTransparente = false) => {
    const zip = new JSZip();
    const canvasContainer = document.createElement("div");
    canvasContainer.style.position = "absolute";
    canvasContainer.style.top = "-9999px";
    canvasContainer.style.left = "-9999px";
    document.body.appendChild(canvasContainer);

    for (let i = 0; i < selectedPeople.length; i++) {
      const person = selectedPeople[i];

      // Generar HTML manual del carnet
      canvasContainer.innerHTML = `
        <div id="carnet-temp" style="width: 340px; height: 214px; font-family: sans-serif; position: relative; background-color: ${fondoTransparente ? 'transparent' : '#003366'}; color: black; border-radius: 8px; padding: 16px;">
          <div style="position: absolute; top: 16px; left: 16px; width: 80px; height: 100px;">
            <img src="${person.foto}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="position: absolute; top: 28px; left: 120px; width: 180px; font-size: 12px;">
            ${!fondoTransparente ? '<p style="font-size:10px;color:white;">U-TAD CENTRO DIGITAL</p><br/>' : ''}
            <p style="font-weight: bold;">${person.nombre} ${person.apellidos}</p>
            <p style="font-weight: bold;">${person.tipoUsuario === 'alumno'
          ? `${person.tipoTitulacion} ${person.titulacion}`
          : person.tipoUsuario === 'profesor'
            ? `${person.cargo} ${person.departamento}`
            : person.cargo
        }</p>
          </div>
          <div style="position: absolute; bottom: 8px; right: 8px;">
            <svg id="barcode-${i}" class="barcode" style="width: 200px;"></svg>
          </div>
        </div>
      `;

      const barcode = canvasContainer.querySelector(`#barcode-${i}`);
      if (barcode) {
        JsBarcode(barcode, person.dni || "", {
          format: "CODE128",
          displayValue: false,
          width: 2,
          height: 25,
          background: fondoTransparente ? "transparent" : "white",
        });
      }

      const canvas = await html2canvas(canvasContainer.querySelector("#carnet-temp"), {
        backgroundColor: fondoTransparente ? "transparent" : "white",
        useCORS: true,
        scale: 8
      });

      await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = `carnet_${person.nombre}_${person.apellidos}.png`;
            zip.file(fileName, blob);
          }
          resolve();
        }, "image/png");
      });
    }

    document.body.removeChild(canvasContainer);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `Carnets_${fondoTransparente ? "transparente" : "visible"}.zip`);
  };

  const exportarDatosEImagenes = async () => {
    const zip = new JSZip();
    const imageFolder = zip.folder("Fotos");

    const imagePromises = selectedPeople.map(async (person) => {
      if (person.foto) {
        try {
          const response = await fetch(person.foto);
          const blob = await response.blob();
          const fileName = `foto_${person.nombre}_${person.apellidos}.jpg`;
          imageFolder.file(fileName, blob);
          return { dni: person.dni, fileName };
        } catch {
          return { dni: person.dni, fileName: "No disponible" };
        }
      }
      return { dni: person.dni, fileName: "No disponible" };
    });

    const imageData = await Promise.all(imagePromises);

    const data = selectedPeople.map((person) => {
      const ocupacion = person.tipoUsuario === "alumno"
        ? `${person.tipoTitulacion} ${person.titulacion}`
        : person.tipoUsuario === "profesor"
          ? `${person.cargo} ${person.departamento}`
          : person.cargo;

      const nombreCompleto = `${person.nombre} ${person.apellidos}`;
      const imageInfo = imageData.find((img) => img.dni === person.dni);
      const fotoFileName = imageInfo ? imageInfo.fileName : "No disponible";

      return {
        "Nombre Completo": nombreCompleto,
        "Ocupación": ocupacion,
        "DNI": person.dni,
        "Foto": fotoFileName
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personas");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    zip.file("personas.xlsx", excelBuffer);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "Personas_Fotos.zip");
  };

  const descargarLogs = () => {
    let logs = "=== Carnets Impresos ===\n";

    selectedPeople.forEach((carnet) => {
      if (carnet.estado === "hecho") {
        logs += `Nombre: ${carnet.nombre} ${carnet.apellidos}\n`;
        logs += `DNI: ${carnet.dni}\n`;
        logs += `Departamento: ${carnet.departamento}\n`;
        logs += `Cargo: ${carnet.cargo}\n`;
        logs += `Correo: ${carnet.correo}\n`;
        logs += `Número de Carnets Impresos: ${carnet.numeroCarnets}\n`;
        logs += "-----------------------------\n";
      }
    });

    logs += "\n=== Carnets con Errores ===\n";

    selectedPeople.forEach((carnet) => {
      let errores = [];
      const camposObligatorios = ["nombre", "apellidos", "dni", "departamento", "cargo", "correo", "direccion", "titulacion", "anio_comienzo", "curso"];
      camposObligatorios.forEach((campo) => {
        if (!carnet[campo]) errores.push(campo);
      });

      if (errores.length > 0) {
        logs += `Nombre: ${carnet.nombre || "N/A"} ${carnet.apellidos || "N/A"}\n`;
        logs += `DNI: ${carnet.dni || "N/A"}\n`;
        logs += `Departamento: ${carnet.departamento || "N/A"}\n`;
        logs += `Cargo: ${carnet.cargo || "N/A"}\n`;
        logs += `Correo: ${carnet.correo || "N/A"}\n`;
        logs += `Dirección: ${carnet.direccion || "N/A"}\n`;
        logs += `Titulación: ${carnet.titulacion || "N/A"}\n`;
        logs += `Año de Comienzo: ${carnet.anio_comienzo || "N/A"}\n`;
        logs += `Curso: ${carnet.curso || "N/A"}\n`;
        logs += `Errores detectados: ${errores.join(", ")}\n`;
        logs += "-----------------------------\n";
      }
    });

    const blob = new Blob([logs], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "logs_carnets.txt");
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full">
      {/* Buscador y filtros */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 mb-6 flex-wrap">
        <div className="relative w-full lg:w-1/3">
          <input
            type="text"
            className="w-full pl-10 py-2 border border-gray-300 rounded-full"
            placeholder="Buscar persona"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img
            src="/images/Buscador.png"
            alt="Buscar"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
        </div>

        <select
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
          className="p-2 border border-gray-300 rounded-full"
        >
          <option value="">Tipo de usuario</option>
          {tiposUsuarios.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Filtros condicionales */}
        {tipoUsuario === "alumno" && (
          <>
            <select
              value={tipoTitulacion}
              onChange={(e) => {
                setTipoTitulacion(e.target.value);
                setTitulacion("");
              }}
              className="p-2 border border-gray-300 rounded-full"
            >
              <option value="">Tipo de titulación</option>
              {tiposTitulacion.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {tipoTitulacion && (
              <select
                value={titulacion}
                onChange={(e) => setTitulacion(e.target.value)}
                className="p-2 border border-gray-300 rounded-full"
              >
                <option value="">Titulación</option>
                {titulaciones[tipoTitulacion].map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}

            <select
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              className="p-2 border border-gray-300 rounded-full"
            >
              <option value="">Curso</option>
              {cursos.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="p-2 border border-gray-300 rounded-full"
            >
              <option value="">Modalidad</option>
              {modalidades.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </>
        )}

        {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="p-2 border border-gray-300 rounded-full"
          >
            <option value="">Cargo</option>
            {cargos.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {tipoUsuario === "profesor" && (
          <select
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            className="p-2 border border-gray-300 rounded-full"
          >
            <option value="">Departamento</option>
            {departamentos.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleFilter}
          className="bg-[#0065ef] text-white px-6 py-2 rounded-full hover:bg-[#0056cc] transition"
        >
          Buscar
        </button>
      </div>

      <div className="flex items-center gap-4 px-2 mb-4">
        {/* Carnets fondo visible */}
        <button onClick={() => descargarCarnetsComoPNG(false)} title="Carnets con fondo visible" >
          <img src="/images/print_icon.png" className="w-5 h-5" alt="Imprimir visible" />
        </button>

        {/* Carnets fondo transparente */}
        <button onClick={() => descargarCarnetsComoPNG(true)} title="Carnets con fondo transparente" >
          <img src="/images/download_icon.png" className="w-5 h-5" alt="Imprimir transparente" />
        </button>

        {/* Exportar Excel e imágenes */}
        <button onClick={exportarDatosEImagenes} title="Exportar datos e imágenes" >
          <img src="/images/datos.png" className="w-5 h-5" alt="Exportar Excel" />
        </button>

        {/* Descargar logs */}
        <button onClick={descargarLogs} title="Descargar logs" >
          <img src="/images/logs.png" className="w-5 h-5" alt="Logs" />
        </button>

        {/* Otros botones sin funcionalidad aún */}
        <button title="opciones (pendiente)">
          <img src="/images/edit_icon.png" className="w-5 h-5" alt="Eliminar" />
        </button>
      </div>

      {/* Tabla */}
      {filteredPeople.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">
                  <button
                    onClick={handleSelectAll}
                    className="text-[#0065ef] hover:underline font-semibold"
                  >
                    {filteredPeople.every(isPersonSelected)
                      ? "Deseleccionar todo"
                      : "Seleccionar todo"}
                  </button>
                </th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Apellidos</th>

                {tipoUsuario === "alumno" && (
                  <>
                    <th className="px-4 py-3">Tipo Titulación</th>
                    <th className="px-4 py-3">Titulación</th>
                    <th className="px-4 py-3">Curso</th>
                  </>
                )}

                {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
                  <>
                    <th className="px-4 py-3">Cargo</th>
                    <th className="px-4 py-3">Departamento</th>
                  </>
                )}

                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Modalidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPeople.map((person, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isPersonSelected(person)}
                      onChange={() => handleSelectPerson(person)}
                      className="accent-[#0065ef]"
                    />
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </td>
                  <td className="px-4 py-2">{person.nombre}</td>
                  <td className="px-4 py-2">{person.apellidos}</td>

                  {tipoUsuario === "alumno" && (
                    <>
                      <td className="px-4 py-2">{person.tipoTitulacion || "-"}</td>
                      <td className="px-4 py-2">{person.titulacion || "-"}</td>
                      <td className="px-4 py-2">{person.curso || "-"}</td>
                    </>
                  )}

                  {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
                    <>
                      <td className="px-4 py-2">{person.cargo || "-"}</td>
                      <td className="px-4 py-2">{person.departamento || "-"}</td>
                    </>
                  )}

                  <td className="px-4 py-2">{person.dni}</td>
                  <td className="px-4 py-2">{person.modalidad || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Botón Siguiente */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          className="bg-[#0065ef] hover:bg-[#0056cc] text-white px-6 py-2 rounded-full font-semibold transition"
          disabled={selectedPeople.length === 0}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
