"use client"
import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import logoU from '@/../../public/images/logoU-tad_U.png';
import logoUtad from '@/../../public/images/logoU-tad.png';


export default function Carnet({ carnet, fondoTransparente=false }) {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (carnet.dni && barcodeRef.current) {
            barcodeRef.current.innerHTML = ""; // Vaciar el SVG antes de generar el código de barras
            JsBarcode(barcodeRef.current, carnet.dni, {
                format: "CODE128",
                displayValue: false,
                width: 2,
                height: 25,
                background: fondoTransparente ? "transparent" : "white"
            });
        }
        console.log(carnet.foto)
    }, [carnet.dni, fondoTransparente]);

    return (
        <div className={`w-[340px] h-[214px] ${fondoTransparente ? 'bg-transparent' : 'bg-AzulUtad'} text-black rounded-lg p-4 font-sans relative`} 
        style={{ backgroundColor: fondoTransparente ? "transparent" : "" }}>
            {/* Contenedor principal */}
            <div className="absolute top-4 left-4 w-[80px] h-[100px]">
                <img src={carnet.foto} alt="Foto no encontrada" className="w-full h-full object-cover" />
            </div>
            
            <div className="absolute top-7 left-[120px] w-[180px] text-xs text-white">
                {!fondoTransparente && <p className='text-xxs'>U-TAD CENTRO DIGITAL</p>}
                <br/>
                <p className='font-bold text-black'>{carnet.nombre} {carnet.apellidos}</p>
                {carnet.tipoUsuario === 'alumno' && (
                    <p className='font-bold text-black'>{carnet.tipoTitulacion} {carnet.titulacion}</p>
                )}
                {carnet.tipoUsuario === 'profesor' && (
                    <p className='font-bold text-black'>{carnet.cargo} {carnet.departamento}</p>
                )}
                {carnet.tipoUsuario === 'personal' && (
                    <p className='font-bold text-black'>{carnet.cargo}</p>
                )}
            </div>
            
            {!fondoTransparente && (
                <div className="absolute top-4 right-4">
                    <img src={logoU.src} alt="Logo U" className="w-[30px] h-[30px]" />
                </div>
            )}
            
            {/* Sección inferior */}
            {!fondoTransparente && (
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={logoUtad.src} alt="Logo Utad" className="w-[90px] h-[40px]" />
                </div>
            )}
            <div className='absolute bottom-4 right-2'>
                <svg ref={barcodeRef} className='w-[200px]'></svg>
            </div>
        </div>
    );
}
