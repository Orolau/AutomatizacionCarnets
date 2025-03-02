"use client";

import FilterForm from "@/app/components/forms/FilterForm";
import Navbar from '@/app/components/ui/Navbar'; // Importa el Navbar

export default function FilterPage() {
  return (
    <>
      <Navbar />{/*Navbar*/}
      <FilterForm />
    </>
  );
}
