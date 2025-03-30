const Person = require("../models/person");
const  sendEmail  = require("../utils/email");

const ErroresToMail = async (req, res) => {
  const REQUIRED_FIELDS = [
    "nombre",
    "apellidos",
    "dni",
    "titulacion",
    "direccion",
    "foto",
    "modalidad",
    "anio_comienzo"
  ];

  try {
    const people = await Person.find();
    let enviados = 0;

    for (const person of people) {
      const correo = person.correo || person.email;

      console.log("🧪 Revisando usuario:", person.nombre, person.apellidos, "-", correo);

      if (!correo || !correo.includes("@")) {
        console.log("❌ Usuario sin correo válido, se omite.\n");
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
          console.log(`❗ Falta el campo "${field}" →`, value);
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

        console.log(`📬 Enviando correo a: ${correo}`);
        console.log("📋 Campos faltantes:", missing);

        await sendEmail(
          correo,
          "Faltan datos en tu ficha de carnet",
          message
        );

        enviados++;
      } else {
        console.log("✅ Todos los datos están completos para este usuario.\n");
      }
    }

    res.status(200).json({ message: `Correos enviados a ${enviados} usuarios con datos incompletos.` });
  } catch (err) {
    console.error("❌ Error al enviar correos:", err);
    res.status(500).json({ error: "Error interno al enviar correos." });
  }
};

module.exports = { ErroresToMail };
