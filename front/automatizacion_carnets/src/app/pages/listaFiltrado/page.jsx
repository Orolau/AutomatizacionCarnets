"use client"
import PersonalDataFiltered from '@/app/components/lists/PersonalDataFiltered';
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
        <PersonalDataFiltered filters={filtros} setFilters={setFiltros} people={personasFiltrado} setSelectedPeople={setSelectedPeople}/>
    )
}