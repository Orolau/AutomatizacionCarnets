// import React, { useState } from "react";
// import "../../styles/EstadoCarnet.css";

// const EstadoDeCarnets = () => {
//   const [carnets, setCarnets] = useState([
//     "Alejandro Pérez - INSO",
//     "María Gómez - INSO",
//     "Javier Fernández - INSO",
//     "Laura Martínez - INSO",
//     "Carlos Rodríguez - INSO",
//   ]);
//   const [terminados, setTerminados] = useState([]);
//   const [mostrarTerminados, setMostrarTerminados] = useState(false);

//   const marcarComoTerminado = (index) => {
//     const carnetEliminado = carnets.splice(index, 1);
//     setCarnets([...carnets]);
//     setTerminados([...terminados, ...carnetEliminado]);
//   };

//   const restaurarCarnet = (index) => {
//     const carnetRestaurado = terminados.splice(index, 1);
//     setTerminados([...terminados]);
//     setCarnets([...carnets, ...carnetRestaurado]);
//   };

//   return (
//     <div className="contenedor">
//       <h2>Estado de Carnets</h2>
//       <ul className="lista-carnets">
//         {carnets.map((carnet, index) => (
//           <li key={index} className="carnet">
//             {carnet} <button onClick={() => marcarComoTerminado(index)}>✔</button>
//           </li>
//         ))}
//       </ul>
//       <button className="btn-terminados" onClick={() => setMostrarTerminados(true)}>
//         Ver Terminados
//       </button>
//       {mostrarTerminados && (
//         <div className="ventana-terminados">
//           <h3>Carnets Terminados</h3>
//           <button className="cerrar" onClick={() => setMostrarTerminados(false)}>✖</button>
//           <ul>
//             {terminados.map((carnet, index) => (
//               <li key={index} className="carnet-terminado">
//                 {carnet} <button onClick={() => restaurarCarnet(index)}>↩</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EstadoDeCarnets;
