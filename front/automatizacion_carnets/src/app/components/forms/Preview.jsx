import { useRouter } from 'next/navigation';  // Importar useRouter
import Carnet from "../Carnet";

const Preview = ({ registros }) => {
    const router = useRouter();

    const handleRedirect = (carnet) => {
        // Redirigir a la página de modificación pasando los datos como query parameters
        router.push(`/pages/modify/${carnet.dni}`)
    };

    return (
        <div className="flex flex-wrap gap-4 justify-center ">
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
    );
};

export default Preview;
