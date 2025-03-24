const passportToDniFormat = (passportNumber) => {
    // Asumiendo que el número de pasaporte puede tener letras o ser un número largo,
    // lo que podemos hacer es eliminar cualquier carácter no numérico.
    
    // Eliminar cualquier carácter no numérico (como letras o símbolos)
    const formattedPassport = passportNumber.replace(/\D/g, '');

    // Verificamos si es un pasaporte con más de 8 dígitos (en caso de que venga con un número muy largo)
    // y truncamos a los 8 primeros dígitos, emulando el formato del DNI.
    const dniFormatted = formattedPassport.substring(0, 8);

    return dniFormatted;
};

// Middleware para procesar el DNI o pasaporte
const processDni = (req, res, next) => {
    const { dni } = req.body;  // Obtenemos el DNI o pasaporte enviado en la petición

    if (dni) {
        // Si el DNI tiene letras, puede ser un pasaporte, por lo que lo procesamos
        const formattedDni = passportToDniFormat(dni);

        // Actualizamos el DNI con el formato correcto
        req.body.dni = formattedDni;
    }

    // Pasamos al siguiente middleware o ruta
    next();
};

module.exports = { processDni };
