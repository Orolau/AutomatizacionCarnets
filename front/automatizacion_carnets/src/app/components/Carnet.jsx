"use client"
import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import logoU from '@/../../public/images/logoU-tad_U.png';
import logoUtad from '@/../../public/images/logoU-tad.png';

export default function Carnet({ carnet }) {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (carnet.dni && barcodeRef.current) {
            JsBarcode(barcodeRef.current, carnet.dni, {
                format: "CODE128",
                displayValue: false,
                width: 2,
                height: 25,
                background: "white"
            });
        }
        console.log(carnet.foto)
    }, [carnet.dni]);

    return (
        <div className="w-[340px] h-[214px] bg-AzulUtad text-black rounded-lg p-4 flex flex-col items-center font-sans relative">
            <div className="p-2 w-full h-4/5 grid grid-cols-3">
                <img src={carnet.foto} alt="Foto no encontrada" className="w-[80px] h-[100px] object-cover" />
                <div className='col-span-2 grid grid-cols-4 ml-4 gap-2 text-xs justify-center'>
                    <div className='text-left col-span-3 flex flex-col gap-2'>
                        <p className='text-white text-xxs'>U-TAD CENTRO DIGITAL</p>
                        <br/>
                        <p className='font-bold'>{carnet.nombre} {carnet.apellidos}</p>
                        {carnet.tipoUsuario === 'alumno' ? <p className='font-bold'>{carnet.tipoTitulacion} {carnet.titulacion}</p> : null}
                        {carnet.tipoUsuario === 'profesor' ? <p className='font-bold'>{carnet.cargo} {carnet.departamento}</p> : null}
                        {carnet.tipoUsuario === 'personal' ? <p className='font-bold'>{carnet.cargo}</p> : null}
                    </div>
                    <img src={logoU.src} alt="Logo U" className="w-[30px] h-[30px]" />
                </div>
            </div>
            <div className="p-2 w-full h-1/6 mt-2 flex items-center flex-row gap-3">
                <img src={logoUtad.src} alt="Logo Utad" className="w-[90px] h-[40px]" />
                <svg ref={barcodeRef}></svg>
            </div>
        </div>
    );
}
