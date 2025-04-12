"use client"

import FilterPersonalDataForm from '@/app/components/forms/FilterPersonalDataForm';
import NavbarTop from "@/app/components/ui/NavbarTop";

export default function PrincipalPage() {
  return (
    <>
      <NavbarTop />
      <div className="bg-white min-h-screen pt-0 px-2 pb-10">
        <div className="max-w-screen-xl mx-auto p-6">
          <FilterPersonalDataForm />
        </div>
      </div>
    </>
  );
}
