"use client"

import UploadExcel from '@/app/components/utils/UploadExcel';
import NavbarTop from "@/app/components/ui/NavbarTop";

export default function UploadAndCreatePage() {
  return (
    <>
      <NavbarTop />
      <div className="bg-white min-h-screen pt-0 px-2 pb-10">
        <div className="max-w-screen-xl mx-auto p-6">
          <UploadExcel />
        </div>
      </div>
    </>
  );
}
