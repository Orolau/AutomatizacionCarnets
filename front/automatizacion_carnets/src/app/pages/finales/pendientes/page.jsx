"use client";

import NavbarTop from "@/app/components/ui/NavbarTop";
import PendingCardList from "@/app/components/lists/PendingCardList";

export default function PendientesPage() {
  return (
    <>
      <NavbarTop />
      <div className="bg-white min-h-screen pt-0 px-2 pb-10">
        <div className="max-w-screen-xl mx-auto p-6">
          <PendingCardList />
        </div>
      </div>
    </>
  );
}
