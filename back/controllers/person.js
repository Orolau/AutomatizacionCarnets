const Person = require("../models/person.js");

// Obtener todas las personas
const getPeople = async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo los datos" });
    }
};

// Obtener personas con filtros
const getFilteredPersons = async (req, res) => {
    try {
        const filters = req.query; // Obtener los filtros de los query params
        const filteredPersons = await Person.find(filters); // Usar los filtros directamente en la consulta
        res.json(filteredPersons); // Devolver las personas filtradas
    } catch (error) {
        res.status(500).json({ message: "Error en la obtención de las personas filtradas", error });
    }
};


// Crear una nueva persona
const createPerson = async (req, res) => {
    const {body} = req;
    const data = await Person.create(body);
    res.json(data)
};

// Obtener una persona por id
const getPersonById = async (req, res) => {
    const {id} = req.params;
    const data = await Person.findOne({"_id": id})
    res.json(data);
};
// Obtener una persona por dni
const getPersonByDNI = async (req, res) => {
    const {dni} = req.params;
    const data = await Person.findOne({"dni": dni})
    res.json(data);
};
// Obtener una persona por dni
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


// Actualizar persona por id
const updatePerson = async (req, res) => {
    const {id} = req.params;
    const data = await Person.findOneAndReplace({"_id": id}, req.body, {new:true});
    res.json(data);
};

// Eliminar persona por id
const deletePerson = async (req, res) => {
    const {id} = req.params;
    const data = await Person.findByIdAndDelete(id);
    res.json(data)
};

const updatePersonPhoto = async (req, res) => {
    try {
        const { dni } = req.params;  // Se recibe el DNI como identificador único
        const { foto } = req.body;   // La nueva URL de la foto viene en el body

        if (!foto) {
            return res.status(400).json({ message: "El campo 'foto' es obligatorio" });
        }

        // Buscar y actualizar solo el campo 'foto'
        const updatedPerson = await Person.findOneAndUpdate(
            { dni }, 
            { $set: { foto } }, 
            { new: true } // Para devolver el documento actualizado
        );

        if (!updatedPerson) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        res.json({ message: "Foto actualizada exitosamente", updatedPerson });
    } catch (error) {
        console.error("Error en updatePersonPhoto:", error.message);
        res.status(500).json({ error: "Error al actualizar la foto" });
    }
};


module.exports = {
    getPersons,
    getFilteredPersons,
    createPerson,
    getPersonById,
    updatePerson,
    deletePerson,
    getPersonByDNI,
    getPersonByName,
    updatePersonPhoto
};
