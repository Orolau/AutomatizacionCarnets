"use client"

import UploadExcel from '@/app/components/utils/UploadExcel';
import NavbarTop from "@/app/components/ui/NavbarTop";

export default function UploadAndCreatePage() {
  return (
    <>
      <NavbarTop />
      <div className="bg-[#cce3ff] min-h-screen pt-0 px-2 pb-10">
        <div className="bg-white mx-auto rounded-2xl shadow-md max-w-screen-xl">
          <UploadExcel />
        </div>
      </div>
    </>
  );
}
