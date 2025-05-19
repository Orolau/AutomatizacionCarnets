// import { useState } from "react";

// const studentsData = [
//   { id: 1, nombre: "Juan Pérez", titulacion: "Ingeniería Informática", dni: "12345678A" },
//   { id: 2, nombre: "María López", titulacion: "Ingeniería Software", dni: "87654321B" },
//   { id: 3, nombre: "Carlos Sánchez", titulacion: "Animación", dni: "11223344C" },
//   { id: 4, nombre: "Ana García", titulacion: "Diseño 3D", dni: "22334455D" },
//   { id: 5, nombre: "David Fernández", titulacion: "Ingeniería Software + Matemáticas", dni: "33445566E" },
// ];

// export default function ModificarErrores() {
//     const [selectedStudent, setSelectedStudent] = useState(null);
//     const [editedData, setEditedData] = useState(null);
  
//     const handleSelectStudent = (student) => {
//       setSelectedStudent(student);
//       setEditedData({ ...student });
//     };  
  
//     const handleChange = (e) => {
//       setEditedData({ ...editedData, [e.target.name]: e.target.value });
//     };
  
//     return (
//         <div className="bg-white min-h-screen flex items-center justify-center">
//           <div className="p-6 max-w-2xl w-full bg-white shadow-lg rounded-lg">
//             {/* Título principal */}
//             <h1 className="text-xl font-bold mb-4 text-black text-center">Editar Carnets Universitarios</h1>
      
//             {/* Lista de estudiantes */}
//             <div className="grid gap-2">
//               {studentsData.map((student) => (
//                 <div
//                   key={student.id}
//                   className="p-4 border rounded-lg cursor-pointer hover:bg-gray-200 transition"
//                   onClick={() => handleSelectStudent(student)}
//                 >
//                   <p className="font-bold text-black">{student.nombre}</p>
//                   <p className="text-sm text-black">{student.titulacion}</p>
//                 </div>
//               ))}
//             </div>
      
//             {/* Formulario de edición */}
//             {selectedStudent && (
//               <div className="mt-6 p-4 border rounded-lg bg-white">
//                 <h2 className="text-lg font-bold mb-2 text-black text-center">
//                   Editar Datos de {selectedStudent.nombre}
//                 </h2>
      
//                 <label className="block mb-2 font-bold text-black">Nombre</label>
//                 <input
//                   type="text"
//                   name="nombre"
//                   value={editedData.nombre}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded text-black bg-white"
//                 />
      
//                 <label className="block mt-2 mb-2 font-bold text-black">Titulación</label>
//                 <input
//                   type="text"
//                   name="titulacion"
//                   value={editedData.titulacion}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded text-black bg-white"
//                 />
      
//                 <label className="block mt-2 mb-2 font-bold text-black">DNI</label>
//                 <input
//                   type="text"
//                   name="dni"
//                   value={editedData.dni}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded text-black bg-white"
//                 />
      
//                 {/* Botón de Guardar */}
//                 <button className="mt-4 px-4 py-2 bg-black text-white rounded font-bold hover:bg-gray-800 transition w-full">
//                   Guardar Cambios
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       );
          
//   }
