const Person = require("../models/person");
const sendEmail = require("../utils/email");

const getErroresPersonas = async (req, res) => {
  const REQUIRED_FIELDS = [
    "nombre",
    "apellidos",
    "dni",
    "titulacion",
    "tipoTitulacion",
    "curso",
    "cargo",
    "departamento",
    "direccion",
    "correo",
    "foto",
    "modalidad"
  ];

  try {
    const people = await Person.find();
    const resultados = [];

    for (const person of people) {
      const errores = [];

      REQUIRED_FIELDS.forEach(field => {
        const value = person[field];

        const isMissing =
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0);

        if (isMissing) errores.push(field);
      });

      if (errores.length > 0) {
        resultados.push({
          id: person._id,
          nombre: person.nombre || "(Sin nombre)",
          apellidos: person.apellidos || "",
          correo: person.correo || "Sin correo",
          totalErrores: errores.length,
          camposFaltantes: errores
        });
      }
    }

    res.status(200).json({
      totalUsuariosConErrores: resultados.length,
      usuarios: resultados
    });

  } catch (error) {
    console.error("Error al analizar campos --> ", error);
    res.status(500).json({ error: "Error interno al procesar los datos" });
  }
};

const enviarCorreosCamposFaltantes = async (req, res) => {
  const CAMPOS_OBLIGATORIOS = ["foto", "direccion", "apellidos", "dni"];
  let enviados = 0;

  try {
      const people = await Person.find();

      for (const person of people) {
          const correo = person.correo || person.email;

          if (!correo || !correo.includes("@")) {
              console.log('Usuario sin correo válido (${person.nombre} ${person.apellidos}), se omite.\n');
              continue;
          }

          const errores = [];

          CAMPOS_OBLIGATORIOS.forEach((campo) => {
              const value = person[campo];
              const isMissing =
                  value === undefined ||
                  value === null ||
                  (typeof value === "string" && value.trim() === "") ||
                  (Array.isArray(value) && value.length === 0);

              if (isMissing) errores.push(campo);
          });

          if (errores.length > 0) {
              enviados++;

              let camposTexto = errores.map(campo => `- ${campo}`).join('\n');

              const message = `
                Buenas ${person.nombre || "usuario/a"}, 

                Hemos detectado que en tus datos de carnet faltan los siguientes campos:

                ${camposTexto}

                Por favor, responde directamente a este correo adjuntando los datos que faltan.

                ¡Muchas gracias!

                Equipo de Administración de Carnets
              `;

              console.log(`📧 Enviando correo a ${correo} por campos faltantes:`, errores);

              await sendEmail(
                  correo,
                  "Faltan datos en tu carnet",
                  message
              );
          }
      }

      res.status(200).json({ message: 'Correos enviados a ${enviados} usuarios con datos incompletos.' });

  } catch (error) {
      console.error("Error al enviar correos:", error);
      res.status(500).json({ error: "Error interno al enviar correos." });
  }
};

module.exports = { getErroresPersonas, enviarCorreosCamposFaltantes };
