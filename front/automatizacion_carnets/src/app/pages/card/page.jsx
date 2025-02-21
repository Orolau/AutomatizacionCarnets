import CarnetToPngConverter from '@/app/components/utils/CarnetToPngConverter.jsx';



export default function cardPage (){
     const carnet = {
        nombre: 'Juan Pérez',
        dni: '12345678A',
        tipoUsuario: 'alumno',
        tipoTitulacion: 'Grado',
        titulacion: 'Ingeniería Informática',
        foto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?cs=srgb&dl=pexels-justin-shaifer-501272-1222271.jpg&fm=jpg'
      };
    return (<div>
        <CarnetToPngConverter carnet={carnet}/>
    </div>)
}