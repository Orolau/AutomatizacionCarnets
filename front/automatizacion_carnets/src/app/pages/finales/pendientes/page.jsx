"use client";

import NavbarTop from "@/app/components/ui/NavbarTop";
import PendingCardList from "@/app/components/lists/PendingCardList";

export default function PendientesPage() {
  return (
    <>
      <NavbarTop />
      <div className="bg-[#cce3ff] min-h-screen pt-0 px-2 pb-10">
        <div className="bg-white mx-auto rounded-2xl shadow-md max-w-screen-xl p-6">
          <PendingCardList />
        </div>
      </div>
    </>
  );
}
