const Person = require("../models/person");
const { sendEmail } = require("../utils/email");

const ErroresToMail = async (req, res) => {
  const REQUIRED_FIELDS = [
    "nombre",
    "apellidos",
    "dni",
    "titulacion",
    "direccion",
    "foto",
    "modalidad",
  ];

  try {
    const people = await Person.find();
    let enviados = 0;
    let logTexto = ""; 

    for (const person of people) {
      const email = person.email;

      logTexto += `Revisando usuario: ${person.nombre} ${person.apellidos}\n`;

      if (!email || !email.includes("@")) {
        logTexto += `Usuario ${person.nombre} ${person.apellidos} sin correo válido: \n`;
        continue; // Saltamos este usuario
      }

      const missing = REQUIRED_FIELDS.filter((field) => {
        const value = person[field];
        const isMissing =
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0);

        if (isMissing) {
          logTexto += `Falta el campo "${field}" → ${value}\n`;
        }

        return isMissing;
      });

      if (missing.length > 0) {
        let errores = "";
        missing.forEach((campo) => {
          errores += `- ${campo}\n`;
        });

        const message = `
Buenas ${person.nombre || "usuario/a"},

Hemos detectado que tu ficha de registro tiene los siguientes campos incompletos o vacíos:

${errores}

Por favor, accede a la plataforma y actualiza estos datos cuanto antes para poder procesar tu carnet correctamente.

Gracias,
Equipo de Administración de Carnets
        `;

        logTexto += `Enviando correo a: ${email}\n`;
        logTexto += `Campos faltantes: [ ${missing.join(", ")} ]\n`;

        await sendEmail(
          email,
          "Faltan datos en tu ficha de carnet",
          message
        );

        logTexto += `Email enviado\n\n`;
        logTexto += `--------------------------------------------------\n\n`;
        enviados++;
      } else {
        logTexto += "Todos los datos están completos para este usuario.\n\n";
      }
    }

    res.status(200).json({
      message: `Correos enviados a ${enviados} usuarios con datos incompletos.`,
      logs: logTexto
    });
  } catch (err) {
    res.status(500).json({ error: "Error interno al enviar correos." });
  }
};

module.exports = { ErroresToMail };