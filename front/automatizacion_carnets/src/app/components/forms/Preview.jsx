import { useRouter } from 'next/navigation';  // Importar useRouter
import Carnet from "../Carnet";

const Preview = ({ registros }) => {
    const router = useRouter();

    const handleRedirect = (carnet) => {
        // Redirigir a la página de modificación pasando los datos como query parameters
        router.push(`/pages/modify/${carnet.dni}`);
    };

    const handleBack = () => {
        // Redirigir a la página de filtrado
        router.push('/pages/finales/principal');
    };

    const handleNext = () => {
        // Redirigir a la página de descargas
        router.push('/pages/download');
    };

    return (
        <div>
            {/* Botones de navegación */}
            <div className="flex justify-between mb-4">
                <button 
                    onClick={handleBack}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Volver a Filtrado
                </button>
                <button 
                    onClick={handleNext}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                    Ir a Descargas
                </button>
            </div>

            {/* Lista de registros */}
            <div className="flex flex-wrap gap-4 justify-center">
                {registros.map((registro) => (
                    <div
                        key={registro.dni}
                        onClick={() => handleRedirect(registro)}
                        className="cursor-pointer"
                    >
                        <Carnet carnet={registro} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Preview;