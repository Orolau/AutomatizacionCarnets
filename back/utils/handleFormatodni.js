const  procesarIdentificador =(identificador) => {
    // Patrón para detectar si es un DNI (asumimos que tiene entre 7 y 9 caracteres alfanuméricos)
    const dniRegex = /^[0-9]{7,9}[A-Za-z]?$/;

    // Si el identificador coincide con el formato de DNI, lo devolvemos tal cual
    if (dniRegex.test(identificador)) {
        return identificador;
    }

    // Si no es un DNI (asumimos que es un pasaporte), devolvemos los últimos 9 caracteres
    return identificador.slice(-9);
}
module.exports = procesarIdentificador;