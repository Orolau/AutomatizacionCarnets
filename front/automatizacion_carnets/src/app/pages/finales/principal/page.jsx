import FilterPersonalDataForm from '@/app/components/forms/FilterPersonalDataForm';
import NavbarTop from "@/app/components/ui/NavbarTop";

export default function PrincipalPage() {
  return (
    <div>
      <NavbarTop />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <FilterPersonalDataForm />
        </div>
      </main>
    </div>
  );
}
