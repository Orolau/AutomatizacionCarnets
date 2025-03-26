"use client"

import UploadExcel from '@/app/components/utils/UploadExcel';
import NavbarTop from "@/app/components/ui/NavbarTop";

export default function UploadAndCreatePage() {

    return (
        <><NavbarTop /><div className="bg-white w-full h-full">
            <UploadExcel />
        </div></>

    );
}