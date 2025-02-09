"use client"
import FiltradoDatosPersonales from '@/app/components/listas/FiltradoDatosPersonales';
import personasFiltrado from '@/app/jsonPruebas/personasFiltrado.json';
import { useState } from 'react';

export default function listaFiltradoPage (){
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [filtros, setFiltros] = useState({
        "curso": "1",
        "titulacion": "Grado de Ingeniería del Software",
        "grupo": "A",
        "tipoTitulacion": "Grado"
      });
    return(
        <FiltradoDatosPersonales filters={filtros} setFilters={setFiltros} people={personasFiltrado} setSelectedPeople={setSelectedPeople}/>
    )
}