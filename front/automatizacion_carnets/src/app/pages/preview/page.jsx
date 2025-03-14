"use client"
import React, { useState, useEffect } from 'react';

import Preview from '@/app/components/forms/Preview';

export default function ModificarErroresPage() {
  const [selectedPeople, setSelectedPeople] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('selectedPeople');
    try {
        if (data) {
            setSelectedPeople(JSON.parse(data));
        }
    } catch (error) {
        console.error("Error al parsear los datos del localStorage", error);
        setSelectedPeople([]);
    }
}, []);

  return (

    <div className="bg-white w-full h-full">
      {/* Lista con fondo gris claro y scroll vertical */}
      <div className="bg-gray-200 w-11/12 h-[calc(100vh-100px)] border rounded-md overflow-y-scroll p-4">
        <Preview registros={selectedPeople} />
      </div>
    </div>

  );
}