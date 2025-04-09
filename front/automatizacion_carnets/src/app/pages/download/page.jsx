"use client"
import ExportExcel from '@/app/components/utils/ExportExcelPeople';
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
    <ExportExcel />
    <ListaCarnetToPngConverter carnets={carnets} />
  </div>)
}