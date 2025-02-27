"use client"
import ListaCarnetToPngConverter from '@/app/components/utils/ListaCarnetToPng';
import { useEffect, useState } from 'react';


export default function cardPage() {
  const [carnets, setCarnets] = useState({})
  useEffect(() => {
    // Recuperar los datos desde el localStorage
    const data = localStorage.getItem('selectedPeople');
    if (data) {
      setCarnets(JSON.parse(data));
    }


    // const fetchCarnet = async () => {
    //   try {
    //     const response = await fetch(`http://localhost:3005/api/person`);
    //     if (!response.ok) throw new Error("Error al obtener datos");

    //     const data = await response.json();
    //     console.log(data)
    //     setCarnets(data);
    //   } catch (error) {
    //     console.error("Error al cargar los datos:", error);
    //   }
    // };

    // fetchCarnet();

  }, []);
  return (<div>
    <ListaCarnetToPngConverter carnets={carnets} />
  </div>)
}