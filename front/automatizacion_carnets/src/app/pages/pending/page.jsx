"use client";

import PendingCardsList from "@/app/components/lists/PendingCardList.jsx";
import Navbar from '@/app/components/ui/Navbar'; // Importa el Navbar

export default function PendingPage() {
  return (
    <>
        <Navbar /> {/* Agrega el Navbar aquí */}
        <PendingCardsList />
    </>
      
  );
}
