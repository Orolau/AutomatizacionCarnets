"use client";

import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Carnet from "../Carnet";
import { useRouter } from "next/navigation";

export default function CarnetToPngConverter({ carnets }) {
    const router = useRouter();
    const carnetRefs = useRef([]);
    const [isReady, setIsReady] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [folderName, setFolderName] = useState("carnets");
    const [fondoTransparente, setFondoTransparente] = useState(false);

    const carnetList = Array.isArray(carnets) ? carnets : Object.values(carnets);

    useEffect(() => {
        let loadedCount = 0;
        let totalImages = 0;
        carnetList.forEach((_, index) => {
            if (!carnetRefs.current[index]) return;
            const imgElements = carnetRefs.current[index].querySelectorAll("img");
            totalImages += imgElements.length;

            imgElements.forEach((img) => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            setImagesLoaded(true);
                        }
                    };
                    img.onerror = () => console.error("Error al cargar imagen:", img.src);
                }
            });
        });

        if (totalImages === 0) {
            setImagesLoaded(true);
        }
    }, [carnetRefs, carnetList]);

    useEffect(() => {
        document.fonts.ready.then(() => {
            if (imagesLoaded) {
                setIsReady(true);
            }
        });
    }, [imagesLoaded]);

    const convertAllToImages = async () => {
        if (!isReady) return;
    
        const zip = new JSZip();
    
        for (let i = 0; i < carnetList.length; i++) {
            const carnet = carnetList[i];
            if (!carnetRefs.current[i]) continue;
    
            const canvas = await html2canvas(carnetRefs.current[i], {
                logging: false,
                useCORS: true,
                backgroundColor: "rgba(0,0,0,0)", // Intenta forzar transparencia
                removeContainer: true,
                scale: 8,
                width: carnetRefs.current[i].clientWidth,
                height: carnetRefs.current[i].clientHeight,
            });
    
            // Generar un Blob en formato PNG
            await new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const fileName = `carnet.${carnet.nombre || "desconocido"}_${carnet.apellidos || "sin_apellidos"}.png`;
                        zip.file(fileName, blob);
                    }
                    resolve();
                }, "image/png");
            });
        }
    
        // Generar el ZIP y descargarlo
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, `${folderName}.zip`);
    };

    const handleNext = () => {
        // Redirigir a la página de etiquetas
        router.push('/pages/etiqueta');
    };

    // Nueva función para generar y descargar logs
    const descargarLogs = () => {
        let logs = "=== Carnets Impresos ===\n";

        carnetList.forEach((carnet) => {
            if (carnet.estaddo === "hecho") {
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

        carnetList.forEach((carnet) => {
            let errores = [];
            const camposObligatorios = ["nombre", "apellidos", "dni", "departamento", "cargo", "correo", "direccion", "titulacion", "anio_comienzo", "curso"];
            
            camposObligatorios.forEach((campo) => {
                if (!carnet[campo]) {
                    errores.push(campo);
                }
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

        // Crear un Blob y forzar la descarga del archivo TXT
        const blob = new Blob([logs], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "logs_carnets.txt");
    };
    

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex items-center w-full justify-between mb-4 p-2 bg-gray-200 rounded">
                <button onClick={() => router.push('/pages/preview')} className="p-2 bg-gray-500 text-white rounded">
                    ← Retroceso
                </button>
                <div className="flex flex-row flex-wrap gap-3">
                    <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Nombre de la carpeta"
                        className="p-2 border border-gray-300 rounded"
                    />
                    <button
                        onClick={convertAllToImages}
                        className="p-2 bg-blue-500 text-white rounded"
                        disabled={!isReady}
                    >
                        Descargar Carnets
                    </button>
                    <button
                        onClick={descargarLogs}
                        className="p-2 bg-purple-500 text-white rounded"
                    >
                        Descargar Logs
                    </button>
                    <button
                        onClick={() => setFondoTransparente(!fondoTransparente)}
                        className={`p-2 rounded ${fondoTransparente ? 'bg-green-500' : 'bg-red-500'} text-white`}
                    >
                        {fondoTransparente ? "Fondo Visible" : "Fondo Transparente"}
                    </button>
                    {/* Botón de Siguiente */}
                    <button
                        onClick={handleNext}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        Siguiente →
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-slate-200 gap-4 justify-center h-[75vh] overflow-y-auto">
                {carnetList.map((carnet, index) => (
                    <div
                        key={index}
                        ref={(el) => (carnetRefs.current[index] = el)}
                        className="w-fit h-fit flex justify-center items-center p-2 rounded shadow-md"
                    >
                        <Carnet carnet={carnet} fondoTransparente={fondoTransparente} />
                    </div>
                ))}
            </div>
        </div>
    );
}