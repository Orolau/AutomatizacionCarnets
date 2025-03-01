const mongoose = require("mongoose");

const estadoSchema = new mongoose.Schema({

    dni: {
        type: String,
        required: true,
        unique: true
    },
    estado: {
        type: String,
        enum: ["hecho", "pendiente"],
        required: true
    },
    numeroCarnets: {
        type: Number,
    }
});

module.exports = mongoose.model("Estado", estadoSchema);
