"use client"
import React, { useState } from 'react';

import Preview from '@/app/components/forms/Preview';
import Navbar from '@/app/components/ui/Navbar'; // Importa el Navbar

export default function ModificarErroresPage() {
    const [registros, setRegistros] = useState([
        {
          nombre: 'Juan Pérez',
          dni: '12345678A',
          tipoUsuario: 'alumno',
          tipoTitulacion: 'Grado',
          titulacion: 'Ingeniería Informática',
          foto: '/path/to/photo2.jpg'
        },
        {
          nombre: 'Ana Gómez',
          dni: '87654321B',
          tipoUsuario: 'profesor',
          cargo: 'Profesor Titular',
          departamento: 'Ciencias de la Computación',
          foto: '/path/to/photo2.jpg'
        },
        {
          nombre: 'Luis Rodríguez',
          dni: '23456789C',
          tipoUsuario: 'personal',
          cargo: 'Jefe de IT',
          foto: '/path/to/photo3.jpg'
        }
      ]);
    return (
        <>
            <Navbar />
            <Preview registros={registros}/>
        </>
    );
}