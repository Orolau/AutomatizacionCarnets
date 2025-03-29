import * as XLSX from 'xlsx';

export default function ExportExcel() {
    const exportToExcel = () => {
        const selectedPeople = JSON.parse(localStorage.getItem("selectedPeople")) || [];

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

            return {
                'Nombre Completo': nombreCompleto,
                'Ocupación': ocupacion,
                'DNI': person.dni,
                'Foto': person.foto
            };
        });

        // Crear un libro de Excel
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Personas");

        // Descargar el archivo
        XLSX.writeFile(workbook, "personas.xlsx");
    };

    return (
        <button onClick={exportToExcel} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-lg">
            Exportar a Excel
        </button>
    );
} 
