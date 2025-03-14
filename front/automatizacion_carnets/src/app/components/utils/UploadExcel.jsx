import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';

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
    // Aquí puedes hacer una llamada a tu API para enviar los datos al backend
    const response = await fetch("http://localhost:3005/api/person/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const result = await response.json();
    
    localStorage.setItem('selectedPeople', JSON.stringify(result.persons)); 
    router.push('/pages/preview')
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-lg w-full max-w-lg mx-auto">
      
      {/* Input para subir archivos */}
      <label className="w-full mb-4">
        <span className="block text-gray-700 font-semibold mb-2">Subir archivo Excel:</span>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </label>

      {/* Botones de acción */}
      <div className="flex justify-between w-full mt-4">
        <button 
          onClick={handleSubmit} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          disabled={data.length === 0}
        >
          Subir Datos
        </button>
      </div>

      {/* Previsualización de datos */}
      {data.length > 0 && (
        <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-4 mt-4 max-h-60 overflow-y-scroll text-sm">
          <pre className="text-gray-700">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadExcel;
