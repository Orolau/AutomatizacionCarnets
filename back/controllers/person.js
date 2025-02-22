const Person = require("../models/person.js");

// Obtener todas las personas
const getPersons = async (req, res) => {
    try {
        const persons = await Person.find();
        res.json(persons);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo los datos" });
    }
};

// Crear una nueva persona
const createPerson = async (req, res) => {
    try {
        const person = new Person(req.body);
        await person.save();
        res.status(201).json(person);
    } catch (error) {
        res.status(400).json({ message: "Error creando la persona" });
    }
};

// Obtener una persona por dni
const getPersonById = async (req, res) => {
    try {
        const person = await Person.findById(req.params.dni);
        if (!person) return res.status(404).json({ message: "Persona no encontrada" });
        res.json(person);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo la persona" });
    }
};

// Actualizar persona por dni
const updatePerson = async (req, res) => {
    try {
        const person = await Person.findByIdAndUpdate(req.params.dni, req.body, { new: true });
        if (!person) return res.status(404).json({ message: "Persona no encontrada" });
        res.json(person);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando la persona" });
    }
};

// Eliminar persona por dni 
const deletePerson = async (req, res) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.dni);
        if (!person) return res.status(404).json({ message: "Persona no encontrada" });
        res.json({ message: "Persona eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando la persona" });
    }
};

module.exports = {
    getPersons,
    createPerson,
    getPersonById,
    updatePerson,
    deletePerson
};
