"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import JsBarcode from "jsbarcode";


const FILTER_URL = "http://localhost:3005/api/person/filtered";

const normalizeText = (text) => {
  if (!text) return "";
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const tiposUsuarios = ["alumno", "profesor", "personal"];
const tiposTitulacion = ["Grado", "Máster"];
const titulaciones = {
  Grado: [
    "AJED",
    "AJEI",
    "ANID",
    "ANIG",
    "ANIV",
    "APDA",
    "ASID",
    "ASIR",
    "CETS",
    "DADU",
    "DAMP",
    "DAWD",
    "DIDI",
    "DIDD",
    "DIPD",
    "DIPG",
    "DIPI",
    "EAVI",
    "EIVJ",
    "ETDU",
    "FIIS",
    "INSD",
    "INSG",
    "INSO",
    "MAIS",
    "MCRS",
    "MUTA",
    "PA2D",
    "PAAN",
    "PADP",
    "PADR",
    "PAVJ",
    "PCAR",
    "PCOD",
    "PDVF",
    "PEVJ",
    "PGAD",
    "PMDL",
    "PPAV",
    "PPLA",
    "PRCF",
    "SMSCH",
  ],
  Máster: [
    "Máster en Programación de Videojuegos",
    "Máster en Big Data",
    "Máster Universitario en tecnologías digitales para el arte",
    "Máster Universitario en Computación Gráfica, Realidad Virtual y Simulación + Título Propio en IA",
    "Máster Universitario en Producción de Animación, Efectos visuales y Videojuegos",
  ],
};
const cursos = ["1º", "2º", "3º", "4º", "5º"];
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

const schema = yup.object().shape({
  tipoUsuario: yup.string().required("Selecciona un tipo de usuario"),
  tipoTitulacion: yup.string(),
  titulacion: yup.string(),
  curso: yup.string(),
  modalidad: yup.string(),
  cargo: yup.string(),
  departamento: yup.string(),
});
export default function PersonalDataFiltered() {
  const router = useRouter();
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [isCargando, setIsCargando] = useState(false);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tipoUsuario: "",
      tipoTitulacion: "",
      titulacion: "",
      curso: "",
      cargo: "",
      departamento: "",
      modalidad: "",
    },
  });

  const tipoUsuario = watch("tipoUsuario");
  const tipoTitulacion = watch("tipoTitulacion");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("filteredPeople");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        setPeople(list);
        setFilteredPeople(list);
      } catch (_) {

      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("filteredPeople", JSON.stringify(filteredPeople));
  }, [filteredPeople]);

  useEffect(() => {
    const filtrosGuardados =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("filtrosCarnets")) || {}
        : {};
    reset(filtrosGuardados);
  }, [reset]);
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

  const onSubmit = async (formData) => {
    const cleanedData = { ...formData };

    // Elimina los campos que no aplican según tipoUsuario
    if (cleanedData.tipoUsuario !== "alumno") {
      delete cleanedData.tipoTitulacion;
      delete cleanedData.titulacion;
      delete cleanedData.curso;
      delete cleanedData.modalidad;
    }
    if (cleanedData.tipoUsuario !== "profesor" && cleanedData.tipoUsuario !== "personal") {
      delete cleanedData.cargo;
    }
    if (cleanedData.tipoUsuario !== "profesor") {
      delete cleanedData.departamento;
    }


    const params = new URLSearchParams();
    Object.entries(cleanedData).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

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

  const descargarCarnetsComoPNG = async (fondoTransparente = false) => {
    if(selectedPeople.length === 0){
      alert("Selecciona los registros que quieres descargar primero")
      return;
    }
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


  const handleSelectPerson = (person) => {
    setSelectedPeople((prev) => {
      const exists = prev.some((p) => p.dni === person.dni);
      return exists
        ? prev.filter((p) => p.dni !== person.dni)
        : [...prev, person];
    });
  };

  function validarDatosRegistro(foto, dni, nombre, apellidos) {
    let esValido = true;

    // Validar que la foto esté presente
    if (!foto || foto==="") {
      esValido = false;
    }
    

    // Validar el formato del DNI (8 números y una letra válida)
    const dniRegex = /^(\d{8})([A-Z])$/i;
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const match = dni.match(dniRegex);

    if (!match) {
      esValido = false;
    }

    // Validar nombre y apellidos: solo letras y espacios
    const textoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!nombre || !textoRegex.test(nombre)) {
      esValido = false;
    }

    if (!apellidos || !textoRegex.test(apellidos)) {
      esValido = false;
    }

    return esValido;
  }


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
      const ocupacion =
        person.tipoUsuario === "alumno"
          ? `${person.tipoTitulacion} ${person.titulacion}`
          : person.tipoUsuario === "profesor"
            ? `${person.cargo} ${person.departamento}`
            : person.cargo;

      const nombreCompleto = `${person.nombre} ${person.apellidos}`;
      const imageInfo = imageData.find((img) => img.dni === person.dni);
      const fotoFileName = imageInfo ? imageInfo.fileName : "No disponible";

      return {
        "Nombre Completo": nombreCompleto,
        Ocupación: ocupacion,
        DNI: person.dni,
        Foto: fotoFileName,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personas");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    zip.file("personas.xlsx", excelBuffer);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "Personas_Fotos.zip");
  };

  const descargarLogs = async () => {
    try {
      setIsCargando(true);
      const res = await fetch("http://localhost:3005/api/auth/notify-errors");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error ejecutando revisión");

      const blob = new Blob([data.logs], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "logs_correos_enviados.txt");
      alert(data.message);
    } catch (error) {
      console.error("Error al generar los logs o enviar correos:", error);
      alert("Hubo un error al ejecutar la acción. Revisa la consola.");
    } finally {
      setIsCargando(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 mb-6 flex-wrap">
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              className="w-full pl-10 py-2 border border-gray-300 rounded-full"
              placeholder="Buscar persona"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img
              src="/images/Buscador.png"
              alt="Buscar"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
            />
          </div>

          <select {...register("tipoUsuario")} className="p-2 border rounded-full">
            <option value="">Tipo de usuario</option>
            {tiposUsuarios.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.tipoUsuario && (
            <p className="text-red-500 text-sm">{errors.tipoUsuario.message}</p>
          )}

          {tipoUsuario === "alumno" && (
            <>
              <select {...register("tipoTitulacion")} className="p-2 border rounded-full">
                <option value="">Tipo de titulación</option>
                {tiposTitulacion.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.tipoTitulacion && (
                <p className="text-red-500 text-sm">{errors.tipoTitulacion.message}</p>
              )}

              <select {...register("titulacion")} className="p-2 border rounded-full">
                <option value="">Titulación</option>
                {tipoTitulacion &&
                  titulaciones[tipoTitulacion]?.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
              {errors.titulacion && (
                <p className="text-red-500 text-sm">{errors.titulacion.message}</p>
              )}

              <select {...register("curso")} className="p-2 border rounded-full">
                <option value="">Curso</option>
                {cursos.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.curso && (
                <p className="text-red-500 text-sm">{errors.curso.message}</p>
              )}

              <select {...register("modalidad")} className="p-2 border rounded-full">
                <option value="">Modalidad</option>
                {modalidades.map((m, i) => (
                  <option key={i} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.modalidad && (
                <p className="text-red-500 text-sm">{errors.modalidad.message}</p>
              )}
            </>
          )}

          {(tipoUsuario === "profesor" || tipoUsuario === "personal") && (
            <>
              <select {...register("cargo")} className="p-2 border rounded-full">
                <option value="">Cargo</option>
                {cargos.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.cargo && (
                <p className="text-red-500 text-sm">{errors.cargo.message}</p>
              )}
            </>
          )}

          {tipoUsuario === "profesor" && (
            <>
              <select {...register("departamento")} className="p-2 border rounded-full">
                <option value="">Departamento</option>
                {departamentos.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.departamento && (
                <p className="text-red-500 text-sm">{errors.departamento.message}</p>
              )}
            </>
          )}

          <button
            type="submit"
            className="bg-[#0065ef] text-white px-6 py-2 rounded-full hover:bg-[#0056cc] transition"
          >
            Buscar
          </button>
        </div>
      </form>


      <div className="flex items-center gap-4 px-2 mb-4">
        <button
          onClick={() => descargarCarnetsComoPNG(true)}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
        >
          <img src="/images/download_icon.png" className="w-4 h-4" alt="Transparente" />
          Transparente
        </button>

        <button
          onClick={() => descargarCarnetsComoPNG(false)}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
        >
          <img src="/images/print_icon.png" className="w-4 h-4" alt="Visible" />
          Visible
        </button>

        <button
          onClick={exportarDatosEImagenes}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
        >
          <img src="/images/datos.png" className="w-4 h-4" alt="Exportar Excel" />
          Exportar
        </button>

        <button
          onClick={descargarLogs}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-sm text-gray-700 hover:bg-blue-200 transition"
        >
          <img src="/images/logs.png" className="w-4 h-4" alt="Logs" />
          Logs
        </button>
      </div>

      {filteredPeople.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[500px] overflow-y-auto">
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
                {[
                  { label: "Nombre", key: "nombre" },
                  { label: "Apellidos", key: "apellidos" },
                  ...(tipoUsuario === "alumno"
                    ? [
                      { label: "Tipo Titulación", key: "tipoTitulacion" },
                      { label: "Titulación", key: "titulacion" },
                      { label: "Curso", key: "curso" },
                    ]
                    : tipoUsuario === "profesor" || tipoUsuario === "personal"
                      ? [
                        { label: "Cargo", key: "cargo" },
                        { label: "Departamento", key: "departamento" },
                      ]
                      : []),
                  { label: "DNI", key: "dni" },
                  { label: "Modalidad", key: "modalidad" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.key && (
                        <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...filteredPeople]
                .sort((a, b) => {
                  const aVal = a[sortField] ?? "";
                  const bVal = b[sortField] ?? "";

                  if (typeof aVal === "number" && typeof bVal === "number") {
                    return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
                  }

                  return sortDirection === "asc"
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
                })
                .map((person, index) => (
                  <tr
                    key={index}
                    onClick={() => handleSelectPerson(person)}
                    className={`transition-all duration-200 ease-in-out rounded-md cursor-pointer ${
                      isPersonSelected(person)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50 hover:scale-[1.01] hover:shadow-md"
                    }`}
                  >
                    <td className="px-4 py-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isPersonSelected(person)}
                        onChange={() => handleSelectPerson(person)}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-[#0065ef]"
                      />
                      <div
                        className={`w-3 h-3 rounded-full ${validarDatosRegistro(person.foto, person.dni, person.nombre, person.apellidos)
                            ? "bg-green-500"
                            : "bg-red-500"
                          }`}
                      ></div>
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
                    <td className="px-4 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/pages/modify/edit?dni=${person.dni}`);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] mt-10 text-center text-gray-500">
          <img
            src="/images/flecha.png"
            alt="Flecha indicador"
            className="mb-4 w-[150px] h-auto"
          />
          <p className="text-xl font-semibold">
            Busca o selecciona tipo de usuario
          </p>
        </div>
      )}

      {isCargando && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Enviando correos...</h2>
            <p className="text-sm text-gray-600">Por favor, espera unos segundos.</p>

            <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-blue-500 animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

