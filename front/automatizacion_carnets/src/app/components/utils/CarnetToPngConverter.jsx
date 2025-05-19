"use client";

import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import download from "downloadjs"; 
import Carnet from "../Carnet"; 

export default function CarnetToJpgConverter({ carnet }) {
    const carnetRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Esperar a que las imágenes dentro del Carnet se carguen
    useEffect(() => {
        if (!carnetRef.current) return;

        const imgElements = carnetRef.current.querySelectorAll("img");
        let loadedCount = 0;

        if (imgElements.length === 0) {
            setImagesLoaded(true);
            return;
        }

        imgElements.forEach((img) => {
            if (img.complete) {
                loadedCount++;
                if (loadedCount === imgElements.length) {
                    setImagesLoaded(true);
                }
            } else {
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === imgElements.length) {
                        setImagesLoaded(true);
                    }
                };
                img.onerror = () => console.error("Error al cargar imagen:", img.src);
            }
        });
    }, [carnetRef]);

    // Esperar a que las fuentes estén cargadas antes de marcar isReady
    useEffect(() => {
        document.fonts.ready.then(() => {
            if (carnetRef.current && imagesLoaded) {
                setIsReady(true);
            }
        });
    }, [imagesLoaded]);

    const convertToImage = () => {
        if (isReady && carnetRef.current) {
            setTimeout(() => {
                html2canvas(carnetRef.current, {
                    logging: false,
                    useCORS: true,
                    backgroundColor: null,
                    scale: window.devicePixelRatio, 
                    width: carnetRef.current.clientWidth,
                    height: carnetRef.current.clientHeight,
                    x: 0,
                    y: 0
                })
                .then((canvas) => {
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
                    download(dataUrl, "carnet.jpg");
                })
                .catch((error) => {
                    console.error("Error al convertir a imagen:", error);
                });
            }, 1000);
        }
    };

    return (
        <div>
            <div ref={carnetRef} style={{ width: "340px", height: "214px" }}>
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
