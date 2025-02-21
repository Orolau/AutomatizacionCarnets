import CarnetToPngConverter from '@/app/components/utils/CarnetToPngConverter.jsx';
import imagenPerfil from '@/../../public/images/images.png';


export default function cardPage (){
     const carnet = {
        nombre: 'Juan Pérez',
        dni: '12345678A',
        tipoUsuario: 'alumno',
        tipoTitulacion: 'Grado',
        titulacion: 'Ingeniería Informática',
        foto: imagenPerfil
      };
    return (<div>
        <CarnetToPngConverter carnet={carnet}/>
    </div>)
}