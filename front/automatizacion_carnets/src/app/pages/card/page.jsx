import Carnet from '../../components/Carnet.jsx';
import imagenPerfil from '@/../../public/images/images.png';

export default function cardPage (){
    return (<div>
        <Carnet dni='12345678H' tipoTitulacion='GRADO' titulacion="INSO" foto={imagenPerfil} nombre='Laura Alvarez Perez' />
    </div>)
}