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

  }, []);
  return (<div>
    <ListaCarnetToPngConverter carnets={carnets} />
  </div>)
}