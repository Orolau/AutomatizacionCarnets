"use client"

import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import download from 'downloadjs'; // Para descargar el archivo
import Carnet from '../Carnet'; // Importa tu componente Carnet

export default function CarnetToJpgConverter({ carnet }) {
    const carnetRef = useRef(null);
    const [isReady, setIsReady] = useState(false); // Controlamos si el componente está listo
    const [imagesLoaded, setImagesLoaded] = useState(false); // Estado para verificar si las imágenes están cargadas

    // Verificar si las imágenes están completamente cargadas
    useEffect(() => {
        const imgElements = document.querySelectorAll('img');
        let loadedCount = 0;

        imgElements.forEach(img => {
            img.onload = () => {
                loadedCount++;
                if (loadedCount === imgElements.length) {
                    setImagesLoaded(true); // Todas las imágenes están cargadas
                }
            };
            img.onerror = () => {
                console.error('Error al cargar imagen:', img.src); // Detectamos imágenes que no se cargan
            };
        });
    }, []);

    // Controlar si el componente está listo para ser convertido
    useEffect(() => {
        if (carnetRef.current && imagesLoaded) {
            setIsReady(true); // Solo lo marcamos como listo cuando las imágenes estén cargadas
        }
    }, [imagesLoaded]);

    const convertToImage = () => {
        console.log("hola", isReady)
        if (isReady && carnetRef.current) {
            setTimeout(() => {
                html2canvas(carnetRef.current, {
                    logging: true, // Habilita los logs para ver detalles en la consola
                    useCORS: true, // Permite el uso de imágenes de orígenes cruzados
                    allowTaint: false, // Evita tainting de imágenes
                    backgroundColor: null, // Fondo transparente
                    scale: 2, // Aumenta la escala de la imagen para mayor calidad
                    x: 0, // Establecer el desplazamiento si es necesario
                    y: 0, // Establecer el desplazamiento si es necesario
                    imageTimeout: 0, // No esperar para imágenes
                    foreignObjectRendering: true, // Mejora el renderizado de elementos complejos
                    width: carnetRef.current.offsetWidth, // Captura el ancho exacto del contenedor
                    height: carnetRef.current.offsetHeight, // Captura la altura exacta del contenedor
                }).then((canvas) => {
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // Cambiamos a JPEG y calidad 0.9
                    download(dataUrl, 'carnet.jpg'); // Descargamos la imagen generada
                }).catch((error) => {
                    console.error('Error al convertir a imagen:', error);
                });
            }, 500); // Añadimos un pequeño retraso para asegurarnos de que las imágenes estén listas
        }
    };

    return (
        <div>
            <div ref={carnetRef} style={{ width: '8.6cm', height: '5.4cm' }}> {/* Tamaño fijo para la tarjeta */}
                <Carnet carnet={carnet} />
            </div>
            <button 
                onClick={convertToImage} 
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Convertir a JPG
            </button>
        </div>
    );
}
