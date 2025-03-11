import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation"; // Importar useRouter

const EtiquetaEnvio = () => {
    const router = useRouter(); // Usar el hook useRouter
    const [carnets, setCarnets] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3005/api/person")
            .then(response => {
                const onlineCarnets = response.data.filter(persona => persona.modalidad === "Online");
                setCarnets(onlineCarnets);
            })
            .catch(error => {
                console.error("Error al obtener los carnets: ", error);
            });
    }, []);

    const generarEtiquetaPDF = () => {
        if (!seleccionado) return;
        
        const doc = new jsPDF();
        const fechaActual = new Date().toLocaleDateString("es-ES");
        const referencia = `REF-${Math.floor(Math.random() * 100000)}`;
        
        doc.setFont("helvetica", "bold");
        doc.text("ENVÍO A:", 20, 20);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Nombre: ${seleccionado.nombre} ${seleccionado.apellidos}`, 20, 30);
        doc.text(`Dirección: ${seleccionado.direccion}`, 20, 40);
        doc.text(`Población: _____________________`, 20, 50);
        doc.text(`Código Postal: _______ Provincia: ____________`, 20, 60);
        doc.text(`Nº Bultos: 1    Envío por: U-tad`, 20, 70);
        doc.text(`Peso kgs.: 0.3    Fecha: ${fechaActual}    Ref.: ${referencia}`, 20, 80);
        doc.text("REMITE: Universidad U-tad", 20, 100);
        
        doc.save("etiqueta_envio.pdf");
    };

    const handleBack = () => {
        // Redirigir a la página de descargas
        router.push('/pages/download');
    };

    return (
        <div className="p-4 text-black">
            {/* Botón de Atrás */}
            <button 
                onClick={handleBack}
                className="p-2 bg-gray-500 text-white rounded-md mb-4"
            >
                ← Atrás
            </button>

            <h2 className="text-xl font-bold text-gray-900">Generar Etiqueta de Envío</h2>
            <p className="mb-4 text-gray-800">Selecciona un carnet con modalidad "Online" para generar su etiqueta de envío.</p>
            
            <ul className="mb-4">
                {carnets.map((carnet) => (
                    <li key={carnet._id} className="flex items-center gap-2 text-gray-900">
                        <input 
                            type="checkbox" 
                            checked={seleccionado?._id === carnet._id} 
                            onChange={() => setSeleccionado(carnet)}
                        />
                        {carnet.nombre} {carnet.apellidos} - {carnet.dni}
                    </li>
                ))}
            </ul>
            
            {seleccionado && (
                <div className="border p-4 bg-gray-100">
                    <h3 className="font-semibold">Etiqueta de Envío</h3>
                    <p><strong>Nombre:</strong> {seleccionado.nombre} {seleccionado.apellidos}</p>
                    <p><strong>DNI:</strong> {seleccionado.dni}</p>
                    <p><strong>Dirección:</strong> {seleccionado.direccion}</p>
                    <p><strong>Correo:</strong> {seleccionado.correo}</p>
                    <p><strong>Titulación:</strong> {seleccionado.titulacion}</p>
                    <button className="mt-2 p-2 bg-blue-500 text-white" onClick={generarEtiquetaPDF}>Descargar Etiqueta</button>
                </div>
            )}
        </div>
    );
};

export default EtiquetaEnvio;