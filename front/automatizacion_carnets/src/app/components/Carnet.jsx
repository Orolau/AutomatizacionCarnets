"use client"
import Image from 'next/image';
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
    }, [carnet.dni]);
    

    return (
            <div className="w-[8.6cm] h-[5.4cm] bg-AzulUtad text-black rounded-lg p-4 flex flex-col items-center font-sans relative">
                <div className="p-2 w-full h-4/5 grid grid-cols-3">
                    <Image src={carnet.foto} alt="Foto no encontrada" width={100} height={70} />
                    <div className='col-span-2 grid grid-cols-4 ml-4 gap-2 text-xs justify-center'>
                        <div className='text-left col-span-3 flex flex-col gap-2'>
                            <p className='text-white text-xxs'>U-TAD CENTRO DIGITAL</p>
                            <p></p>
                            <p className='font-semibold'>{carnet.nombre}</p>
                            {carnet.tipoUsuario === 'alumno' ?<p className='font-semibold'>{carnet.tipoTitulacion} {carnet.titulacion}</p> : null}
                            {carnet.tipoUsuario === 'profesor' ?<p className='font-semibold'>{carnet.cargo} {carnet.departamento}</p> : null}
                            {carnet.tipoUsuario === 'personal' ?<p className='font-semibold'>{carnet.cargo}</p> : null}
                            
                        </div>
                        <Image src={logoU}  alt="Foto no encontrada" width={30} height={30} />
                    </div>
                </div>
                
                <div className="p-2 w-full h-1/6  mt-2 flex items-center flex-row gap-3">
                    <Image src={logoUtad}  alt="Foto no encontrada" width={100} height={100} />
                    <svg ref={barcodeRef}></svg>
                </div>
            </div>
       
    );
}