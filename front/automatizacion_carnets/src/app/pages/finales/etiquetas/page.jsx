"use client";

import EtiquetaEnvio from "@/app/components/forms/EtiquetaEnvio";
import NavbarTop from "@/app/components/ui/NavbarTop";

export default function EtiquetasPage() {
  return (
    <>
      <NavbarTop />
      <div className="bg-[#cce3ff] min-h-screen pt-0 px-2 pb-10">
        <div className="bg-white mx-auto rounded-2xl shadow-md max-w-screen-xl p-6">
          <EtiquetaEnvio />
        </div>
      </div>
    </>
  );
}
