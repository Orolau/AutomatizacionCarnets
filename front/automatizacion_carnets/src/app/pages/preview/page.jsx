"use client"
import React, { useState, useEffect } from 'react';

import Preview from '@/app/components/forms/Preview';

export default function ModificarErroresPage() {
  const [selectedPeople, setSelectedPeople] = useState([]);

    useEffect(() => {
        // Recuperar los datos desde el localStorage
        const data = localStorage.getItem('selectedPeople');
        if (data) {
            setSelectedPeople(JSON.parse(data));
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