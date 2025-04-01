import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ExportExcel() {
    const exportToExcelAndZip = async () => {
        const selectedPeople = JSON.parse(localStorage.getItem("selectedPeople")) || [];
        const zip = new JSZip();
        const imageFolder = zip.folder("Fotos");

        //Crear promesas para descargar imágenes y obtener nombres
        const imagePromises = selectedPeople.map(async person => {
            if (person.foto) {
                try {
                    const response = await fetch(person.foto);
                    if (!response.ok) throw new Error(`Error al descargar ${person.foto}`);

                    const blob = await response.blob();
                    const fileName = `foto_${person.nombre}_${person.apellidos}.jpg`; //Nombre ordenado
                    imageFolder.file(fileName, blob);

                    return { dni: person.dni, fileName }; // Guardamos relación DNI - Nombre de archivo
                } catch (error) {
                    console.error("Error al descargar imagen:", error);
                    return { dni: person.dni, fileName: "No disponible" }; // Manejo de error
                }
            }
            return { dni: person.dni, fileName: "No disponible" };
        });

        //Esperar a que todas las imágenes se descarguen
        const imageData = await Promise.all(imagePromises);

        //Crear los datos del Excel, reemplazando la URL por el nombre del archivo
        const data = selectedPeople.map(person => {
            const nombreCompleto = `${person.nombre} ${person.apellidos}`;
            let ocupacion = "";

            if (person.tipoUsuario === "alumno") {
                ocupacion = `${person.tipoTitulacion} ${person.titulacion}`;
            } else if (person.tipoUsuario === "profesor") {
                ocupacion = `${person.cargo} ${person.departamento}`;
            } else {
                ocupacion = person.cargo;
            }

            const imageInfo = imageData.find(img => img.dni === person.dni);
            const fotoFileName = imageInfo ? imageInfo.fileName : "No disponible";

            return {
                'Nombre Completo': nombreCompleto,
                'Ocupación': ocupacion,
                'DNI': person.dni,
                'Foto': fotoFileName  //Guardamos solo el nombre del archivo en Excel
            };
        });

        //Crear el archivo Excel
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Personas");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        //Añadir el Excel al ZIP
        zip.file("personas.xlsx", excelBuffer);

        //Generar y descargar el ZIP
        zip.generateAsync({ type: "blob" }).then(zipBlob => {
            saveAs(zipBlob, "Personas_Fotos.zip");
        });
    };

    return (
        <button 
            onClick={exportToExcelAndZip} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-lg"
        >
            Exportar Datos e Imágenes
        </button>
    );
}
