"use client"

import FilterPersonalDataForm from '@/app/components/forms/FilterPersonalDataForm';
import NavbarTop from "@/app/components/ui/NavbarTop";

export default function PrincipalPage() {
  return (
    <>
      <NavbarTop />
      <div className="bg-[#cce3ff] min-h-screen pt-0 px-2 pb-10">
        <div className="bg-white mx-auto rounded-2xl shadow-md max-w-screen-xl p-6">
          <FilterPersonalDataForm />
        </div>
      </div>
    </>
  );
}
