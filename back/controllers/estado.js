const Estado = require("../models/estado.js");


// Obtener todos los carnets
const getTodos = async (req, res) => {
    try {
        const estados = await Estado.find();
        res.json(estados);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};

// Obtener solo los carnets terminados (estado: hecho)
const getTerminados = async (req, res) => {
    try {
        const terminados = await Estado.find({ estado: "hecho" });
        res.json(terminados);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};

// Actualizar el estado de un carnet
const putEstado = async (req, res) => {
    try {
        const { dni } = req.params;
        const { estado } = req.body;

        if (!["hecho", "pendiente"].includes(estado)) {
            return res.status(400).json({ mensaje: "Estado inválido" });
        }

        const carnet = await Estado.findOneAndUpdate(
            { dni },
            { estado },
            { new: true }
        );

        if (!carnet) {
            return res.status(404).json({ mensaje: "Carnet no encontrado" });
        }

        res.json(carnet);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};

module.exports = { getTodos, getTerminados, putEstado };
