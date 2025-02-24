"use client"
import React, { useState } from 'react';

import Preview from '@/app/components/forms/Preview';
import Navbar from '@/app/components/ui/Navbar'; // Importa el Navbar

export default function ModificarErroresPage() {
  const [registros, setRegistros] = useState([
    {
      nombre: 'Juan Pérez',
      dni: '45678901E',
      tipoUsuario: 'alumno',
      tipoTitulacion: 'Grado',
      titulacion: 'Ingeniería Informática',
      foto: '/path/to/photo2.jpg'
    },
    {
      nombre: 'Ana Gómez',
      dni: '12345678A',
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

    <div className="bg-white w-full h-full">
      <Navbar />
      {/* Lista con fondo gris claro y scroll vertical */}
      <div className="bg-gray-200 w-11/12 h-[calc(100vh-100px)] border rounded-md overflow-y-scroll p-4">
        <Preview registros={registros} />
      </div>
    </div>

  );
}