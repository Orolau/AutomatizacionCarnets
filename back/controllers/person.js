const Person = require("../models/person.js");
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
        res.status(500).json({ message: "Error obteniendo los datos" });
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
        res.status(500).json({ message: "Error en la obtención de las personas filtradas", error });
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
 *       201:
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
    const { body } = req;
    const data = await Person.create(body);
    res.json(data)
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
 */

const getPersonById = async (req, res) => {
    const { id } = req.params;
    const data = await Person.findOne({ "_id": id })
    res.json(data);
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
 */

const getPersonByDNI = async (req, res) => {
    const { dni } = req.params;
    const data = await Person.findOne({ "dni": dni })
    res.json(data);
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
 */

const getPersonByName = async (req, res) => {
    try {
        const { nombreCompleto } = req.params;

        // Separar en nombre y apellidos
        const [nombre, ...apellidosArray] = nombreCompleto.split(" ");
        const apellidos = apellidosArray.join(" ");

        const data = await Person.findOne({ nombre, apellidos });

        if (!data) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        res.json(data);
    } catch (error) {
        console.error("Error en getPersonByName:", error.message);
        res.status(500).json({ error: "Error al obtener la persona" });
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

    // Asegúrate de que 'id' no sea undefined
    if (!id) {
        return res.status(400).json({ error: "ID es requerido" });
    }

    try {
        const updatedPerson = await Person.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPerson) {
            return res.status(404).json({ error: "Persona no encontrada" });
        }
        console.log(updatePerson)
        res.json(updatedPerson);  // Responde con los datos actualizados
    } catch (error) {
        console.error("Error al actualizar la persona:", error);
        res.status(500).json({ error: "Error interno del servidor" });
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
    const { id } = req.params;
    const data = await Person.findByIdAndDelete(id);
    res.json(data)
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
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

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
                dni: personData.dni,
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
        console.error(error);
        return res.status(500).json({ message: "Error al procesar el archivo" });
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
    createPeopleWithFile
};
