"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const router = useRouter();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3005/api/person/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (response.status === 409) {
        alert("No se pueden crear usuarios repetidos");
        return;
      }

      const result = await response.json();
      localStorage.setItem("selectedPeople", JSON.stringify(result.persons));
      router.push("/pages/finales/principal");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al procesar la solicitud");
    }

  };

  return (
    <div className="flex justify-center items-center w-full min-h-[calc(100vh-80px)] px-8 py-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6 h-full">

        {/* Dropzone central */}
        <label
          htmlFor="excel-upload"
          className="flex-1 border-2 border-dashed border-gray-300 bg-[#f4f4f4] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0065ef] transition min-h-[60vh]"
        >
          <div className="mb-4">
            <img
              src="/images/excel_drop_icon.png"
              alt="Subida Excel"
              className="w-40 h-40"
            />
          </div>


          <p className="text-gray-600 text-sm">
            Arrastra un documento excel aquí <br />
            o{" "}
            <span className="text-[#0065ef] underline">
              sube un archivo
            </span>
          </p>

          <input
            id="excel-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#0065ef] hover:bg-[#005dd7] text-white px-6 py-2 rounded-full font-semibold transition"
            disabled={data.length === 0}
          >
            Subir Datos
          </button>
        </div>

        {/* Vista previa */}
        {data.length > 0 && (
          <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-4 max-h-60 overflow-y-scroll text-sm">
            <pre className="text-gray-700">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadExcel;
