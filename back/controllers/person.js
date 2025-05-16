const Person = require("../models/person.js");
const { handleHttpError } = require("../utils/handleError.js");
const procesarIdentificador = require("../utils/handleFormatodni.js");
const { uploadToPinata } = require("../utils/pinata");
/**
 * @swagger
 * tags:
 *   - name: Personas
 *     description: Operaciones relacionadas con personas
 */
/**
 * @swagger
 * /api/person:
 *   get:
 *     summary: Obtener todas las personas
 *     description: Retorna una lista de todas las personas en la base de datos.
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Lista de personas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tipoUsuario:
 *                     type: string
 *                     enum: [alumno, personal, profesor]
 *                   nombre:
 *                     type: string
 *                   apellidos:
 *                     type: string
 *                   titulacion:
 *                     type: string
 *                   tipoTitulacion:
 *                     type: string
 *                     enum: [Grado, Ciclo superior, Máster, ""]
 *                   cargo:
 *                     type: string
 *                   departamento:
 *                     type: string
 *                   email:
 *                     type: string
 *                   dni:
 *                     type: string
 *                   foto:
 *                     type: string
 *                   modalidad:
 *                     type: string
 *                     enum: [Presencial, Online]
 */

const getPeople = async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (error) {
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }
};

/**
 * @swagger
 * /api/person/filtered:
 *   get:
 *     summary: Obtener personas con filtros
 *     description: Devuelve personas filtradas según los parámetros proporcionados.
 *     tags: [Personas]
 *     parameters:
 *       - name: tipoUsuario
 *         in: query
 *         description: Tipo de usuario (alumno, profesor, personal)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [alumno, personal, profesor]
 *       - name: nombre
 *         in: query
 *         description: Nombre de la persona
 *         required: false
 *         schema:
 *           type: string
 *       - name: apellidos
 *         in: query
 *         description: Apellidos de la persona
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de personas filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tipoUsuario:
 *                     type: string
 *                     enum: [alumno, personal, profesor]
 *                   nombre:
 *                     type: string
 *                   apellidos:
 *                     type: string
 *                   titulacion:
 *                     type: string
 *                   tipoTitulacion:
 *                     type: string
 *                     enum: [Grado, Ciclo superior, Máster, ""]
 *                   cargo:
 *                     type: string
 *                   departamento:
 *                     type: string
 *                   email:
 *                     type: string
 *                   dni:
 *                     type: string
 *                   foto:
 *                     type: string
 *                   modalidad:
 *                     type: string
 *                     enum: [Presencial, Online]
 */

const getFilteredPersons = async (req, res) => {
    try {
        const filters = req.query; // Obtener los filtros de los query params
        const filteredPersons = await Person.find(filters); // Usar los filtros directamente en la consulta
        res.json(filteredPersons); // Devolver las personas filtradas
    } catch (error) {
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }
};


/**
 * @swagger
 * /api/person:
 *   post:
 *     summary: Crear una nueva persona
 *     description: Crea una nueva persona en la base de datos.
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoUsuario:
 *                 type: string
 *                 enum: [alumno, personal, profesor]
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               titulacion:
 *                 type: string
 *               tipoTitulacion:
 *                 type: string
 *                 enum: [Grado, Ciclo superior, Máster, ""]
 *               cargo:
 *                 type: string
 *               departamento:
 *                 type: string
 *               email:
 *                 type: string
 *               dni:
 *                 type: string
 *               foto:
 *                 type: string
 *               modalidad:
 *                 type: string
 *                 enum: [Presencial, Online]
 *     responses:
 *       409:
 *          description: La persona ya existe
 *       403:
 *          description: Error de validación.  Los datos introducidos contienen errores
 *       200:
 *         description: Persona creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoUsuario:
 *                   type: string
 *                   enum: [alumno, personal, profesor]
 *                 nombre:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 titulacion:
 *                   type: string
 *                 tipoTitulacion:
 *                   type: string
 *                   enum: [Grado, Ciclo superior, Máster, ""]
 *                 cargo:
 *                   type: string
 *                 departamento:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dni:
 *                   type: string
 *                 foto:
 *                   type: string
 *                 modalidad:
 *                   type: string
 *                   enum: [Presencial, Online]
 */

const createPerson = async (req, res) => {
    try {
        const { body } = req;
        const data = await Person.create(body);
        res.json(data);
    } catch (error) {
        if(error.code === 11000)
            handleHttpError(res, "PERSON_EXISTS", 409)
        else
            handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }
};

/**
 * @swagger
 * /api/person/{id}:
 *   get:
 *     summary: Obtener una persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la persona a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoUsuario:
 *                   type: string
 *                   enum: [alumno, personal, profesor]
 *                 nombre:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 titulacion:
 *                   type: string
 *                 tipoTitulacion:
 *                   type: string
 *                   enum: [Grado, Ciclo superior, Máster, ""]
 *                 cargo:
 *                   type: string
 *                 departamento:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dni:
 *                   type: string
 *                 foto:
 *                   type: string
 *                 modalidad:
 *                   type: string
 *                   enum: [Presencial, Online]
 *       404:
 *         description: Persona no encontrada
 *      403:
 *         description: Error en el formato. DNI inválido
 */

const getPersonById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Person.findOne({ "_id": id })
        if (!data)
            return handleHttpError(res, "PERSON_NOT_FOUND", 404)
        res.json(data);
    } catch (error) {
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }

};
/**
 * @swagger
 * /api/person/dni/{dni}:
 *   get:
 *     summary: Obtener una persona por DNI
 *     tags: [Personas]
 *     parameters:
 *       - name: dni
 *         in: path
 *         required: true
 *         description: DNI de la persona a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoUsuario:
 *                   type: string
 *                   enum: [alumno, personal, profesor]
 *                 nombre:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 titulacion:
 *                   type: string
 *                 tipoTitulacion:
 *                   type: string
 *                   enum: [Grado, Ciclo superior, Máster, ""]
 *                 cargo:
 *                   type: string
 *                 departamento:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dni:
 *                   type: string
 *                 foto:
 *                   type: string
 *                 modalidad:
 *                   type: string
 *                   enum: [Presencial, Online]
 *       404:
 *         description: Persona no encontrada
 *       403:
 *         description: Error en el formato. DNI inválido
 */

const getPersonByDNI = async (req, res) => {
    try {
        const { dni } = req.params;
        const data = await Person.findOne({ "dni": dni })
        if (!data)
            return handleHttpError(res, "PERSON_NOT_FOUND", 404)
        res.json(data);
    } catch (error) {
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }

};
/**
 * @swagger
 * /api/person/name/{nombreCompleto}:
 *   get:
 *     summary: Obtener una persona por nombre completo
 *     tags: [Personas]
 *     parameters:
 *       - name: nombreCompleto
 *         in: path
 *         required: true
 *         description: Nombre completo de la persona
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoUsuario:
 *                   type: string
 *                   enum: [alumno, personal, profesor]
 *                 nombre:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 titulacion:
 *                   type: string
 *                 tipoTitulacion:
 *                   type: string
 *                   enum: [Grado, Ciclo superior, Máster, ""]
 *                 cargo:
 *                   type: string
 *                 departamento:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dni:
 *                   type: string
 *                 foto:
 *                   type: string
 *                 modalidad:
 *                   type: string
 *                   enum: [Presencial, Online]
 *       404:
 *         description: Persona no encontrada
 *       403:
 *         description: Error en el formato. Nombre inválido
 */

const getPersonByName = async (req, res) => {
    try {
        const { nombreCompleto } = req.params;

        // Separar en nombre y apellidos
        const [nombre, ...apellidosArray] = nombreCompleto.split(" ");
        const apellidos = apellidosArray.join(" ");

        const data = await Person.findOne({ nombre, apellidos });

        if (!data) {
            return handleHttpError(res, "PERSON_NOT_FOUND", 404)
        }

        res.json(data);
    } catch (error) {
        console.error("Error en getPersonByName:", error.message);
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }
};
/**
 * @swagger
 * /api/person/{id}:
 *   put:
 *     summary: Actualizar persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la persona a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoUsuario:
 *                 type: string
 *                 enum: [alumno, personal, profesor]
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               titulacion:
 *                 type: string
 *               tipoTitulacion:
 *                 type: string
 *                 enum: [Grado, Ciclo superior, Máster, ""]
 *               cargo:
 *                 type: string
 *               departamento:
 *                 type: string
 *               email:
 *                 type: string
 *               dni:
 *                 type: string
 *               foto:
 *                 type: string
 *               modalidad:
 *                 type: string
 *                 enum: [Presencial, Online]
 *     responses:
 *       200:
 *         description: Persona actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoUsuario:
 *                   type: string
 *                   enum: [alumno, personal, profesor]
 *                 nombre:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 titulacion:
 *                   type: string
 *                 tipoTitulacion:
 *                   type: string
 *                   enum: [Grado, Ciclo superior, Máster, ""]
 *                 cargo:
 *                   type: string
 *                 departamento:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dni:
 *                   type: string
 *                 foto:
 *                   type: string
 *                 modalidad:
 *                   type: string
 *                   enum: [Presencial, Online]
 *       404:
 *         description: Persona no encontrada
 */

const updatePerson = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID es requerido" });
    }

    try {
        if (req.body.dni) {
            req.body.dni = procesarIdentificador(req.body.dni)
        }
        const updatedPerson = await Person.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPerson) {
            return handleHttpError(res, "PERSON_NOT_FOUND", 404)
        }
        res.json(updatedPerson);  // Responde con los datos actualizados
    } catch (error) {
        console.error("Error al actualizar la persona:", error);
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }
};


/**
 * @swagger
 * /api/person/{id}:
 *   delete:
 *     summary: Eliminar persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la persona a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoUsuario:
 *                   type: string
 *                   enum: [alumno, personal, profesor]
 *                 nombre:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 titulacion:
 *                   type: string
 *                 tipoTitulacion:
 *                   type: string
 *                   enum: [Grado, Ciclo superior, Máster, ""]
 *                 cargo:
 *                   type: string
 *                 departamento:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dni:
 *                   type: string
 *                 foto:
 *                   type: string
 *                 modalidad:
 *                   type: string
 *                   enum: [Presencial, Online]
 */

const deletePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Person.findByIdAndDelete(id);
        res.json(data)
    } catch (error) {
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }

};

/**
 * @swagger
 * /api/person/{id}/upload-image:
 *   put:
 *     summary: Subir imagen y actualizar foto de la persona
 *     tags: [Personas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la persona a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedPerson:
 *                   type: object
 *                   properties:
 *                     tipoUsuario:
 *                       type: string
 *                       enum: [alumno, personal, profesor]
 *                     nombre:
 *                       type: string
 *                     apellidos:
 *                       type: string
 *                     titulacion:
 *                       type: string
 *                     tipoTitulacion:
 *                       type: string
 *                       enum: [Grado, Ciclo superior, Máster, ""]
 *                     cargo:
 *                       type: string
 *                     departamento:
 *                       type: string
 *                     email:
 *                       type: string
 *                     dni:
 *                       type: string
 *                     foto:
 *                       type: string
 *                     modalidad:
 *                       type: string
 *                       enum: [Presencial, Online]
 *       404:
 *         description: Persona no encontrada
 */

const uploadImageAndUpdatePerson = async (req, res) => {
    try {
        const { id } = req.params; // Asegúrate de que id existe y es correcto
        if (!req.file) {
            return res.status(400).json({ message: "No se ha proporcionado ninguna imagen." });
        }

        // Subir imagen a Pinata
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata(fileBuffer, fileName);

        if (!pinataResponse.IpfsHash) {
            throw new Error("No se pudo obtener el hash de la imagen en Pinata.");
        }

        // Construir URL de la imagen en IPFS
        const imageUrl = `https://${process.env.PINATA_GATEWAY}/ipfs/${pinataResponse.IpfsHash}`;

        // Actualizar el campo "foto" en MongoDB
        const updatedPerson = await Person.findByIdAndUpdate(
            id,
            { $set: { foto: imageUrl } },
            { new: true }
        );

        if (!updatedPerson) {
            return res.status(404).json({ message: "Persona no encontrada." });
        }

        res.json({ message: "Foto actualizada correctamente", updatedPerson });
    } catch (error) {
        console.error("Error al subir la imagen y actualizar la persona:", error);
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }
};

/**
 * @swagger
 * /api/person/create:
 *   post:
 *     summary: Crea múltiples personas en la base de datos
 *     description: Recibe una lista de personas en el cuerpo de la solicitud y las guarda en la base de datos.
 *     tags:
 *       - Personas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tipoUsuario:
 *                       type: string
 *                       description: Tipo de usuario, puede ser 'alumno', 'personal' o 'profesor'.
 *                       default: "alumno"
 *                     nombre:
 *                       type: string
 *                       description: Nombre de la persona.
 *                     apellidos:
 *                       type: string
 *                       description: Apellidos de la persona.
 *                     titulacion:
 *                       type: string
 *                       description: Titulación de la persona (solo para alumnos).
 *                       nullable: true
 *                     tipoTitulacion:
 *                       type: string
 *                       description: Tipo de titulación (solo para alumnos).
 *                       default: ""
 *                     cargo:
 *                       type: string
 *                       description: Cargo de la persona (solo para personal y profesores).
 *                       nullable: true
 *                     departamento:
 *                       type: string
 *                       description: Departamento de la persona (solo para profesores).
 *                       nullable: true
 *                     email:
 *                       type: string
 *                       description: Correo electrónico de la persona.
 *                       format: email
 *                     dni:
 *                       type: string
 *                       description: DNI de la persona, debe seguir el formato 12345678X.
 *                     foto:
 *                       type: string
 *                       description: URL de la foto de la persona.
 *                       nullable: true
 *                       default: ""
 *                     modalidad:
 *                       type: string
 *                       description: Modalidad en la que se encuentra la persona ('Presencial' o 'Online').
 *                       default: "Presencial"
 *                     curso:
 *                       type: string
 *                       description: Curso de la persona (solo para alumnos).
 *                       nullable: true
 *                       default: ""
 *     responses:
 *       201:
 *         description: Datos cargados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                   example: "Datos cargados correctamente"
 *                 persons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'
 *       403:
 *         description: Error de validación de los datos proporcionados.
 *       500:
 *         description: Error en el servidor al procesar los datos.
 */
const createPeopleWithFile = async (req, res) => {
    try {
        const { data } = req.body; // Datos provenientes del frontend
        const persons = [];

        for (let i = 0; i < data.length; i++) {
            const personData = data[i];

            // Construcción de un objeto de acuerdo con el modelo
            const person = {
                tipoUsuario: personData.tipoUsuario || "alumno",
                nombre: personData.nombre,
                apellidos: personData.apellidos,
                titulacion: personData.titulacion || undefined,  // Solo para alumnos
                tipoTitulacion: personData.tipoTitulacion || "",
                cargo: personData.cargo || undefined,  // Solo para personal y profesores
                departamento: personData.departamento || undefined,  // Solo para profesores
                email: personData.email,
                dni: procesarIdentificador(personData.dni),
                foto: personData.foto || "",
                modalidad: personData.modalidad || "Presencial",
                curso: personData.curso || "" // Solo para alumnos
            };

            // Creamos un nuevo documento Person
            const newPerson = new Person(person);
            await newPerson.save();
            persons.push(newPerson);
        }

        return res.status(201).json({ message: "Datos cargados correctamente", persons });
    } catch (error) {

        if (error.code === 11000)
            handleHttpError(res, "PERSON_EXISTS", 409)
        else
            handleHttpError(res, "INTERNAL_SERVER_ERROR", 500)
    }
};


/**
 * @swagger
 * /api/person/estado/{dni}:
 *   put:
 *     summary: Actualizar el estado de un carnet
 *     description: Cambia el estado del carnet de una persona (puede ser "hecho" o "pendiente"). Si el estado cambia de "pendiente" a "hecho", se incrementa el número de carnets.
 *     tags:
 *       - Personas
 *     parameters:
 *       - name: dni
 *         in: path
 *         description: DNI de la persona a la que se le va a actualizar el estado del carnet.
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345678X"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estadoCarnet:
 *                 type: string
 *                 description: El estado del carnet. Puede ser "hecho" o "pendiente".
 *                 enum:
 *                   - hecho
 *                   - pendiente
 *     responses:
 *       200:
 *         description: El estado del carnet ha sido actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dni:
 *                   type: string
 *                   description: El DNI de la persona actualizada.
 *                 estadoCarnet:
 *                   type: string
 *                   description: El nuevo estado del carnet de la persona.
 *       400:
 *         description: Estado inválido proporcionado en el cuerpo de la solicitud.
 *       404:
 *         description: Persona no encontrada con el DNI proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */
const putEstado = async (req, res) => {
    try {
        const { dni } = req.params;
        const { estadoCarnet } = req.body;

        const persona = await Person.findOne({ dni });

        if (!persona) {
            return res.status(404).json({ mensaje: "Persona no encontrada" });
        }

        // Si cambia de "pendiente" a "hecho", aumentar numeroCarnet
        if (persona.estadoCarnet === "pendiente" && estadoCarnet === "hecho") {
            await Person.updateOne(
                { dni },
                { $inc: { numeroCarnets: 1 } }
            );
        }

        const updatedPersona = await Person.findOneAndUpdate(
            { dni },
            { $set: { estadoCarnet } },
            { new: true, runValidators: false }
        );

        res.json(updatedPersona);
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};


module.exports = {
    getPeople,
    getFilteredPersons,
    createPerson,
    getPersonById,
    updatePerson,
    deletePerson,
    getPersonByDNI,
    getPersonByName,
    uploadImageAndUpdatePerson,
    createPeopleWithFile,
    putEstado
};
