const mongoose = require("mongoose");
const PersonScheme = new mongoose.Schema(
    {
        tipoUsuario: {
            type: ["alumno", "personal", "profesor"],
            default: "alumno"
        },
        nombre: {
            type: String
        },
        titulacion: {
            type: String
        },
        tipoTitulacion:{
            type: ["grado", "grado superior", "postgrado", ""],
            default: ""
        },
        cargo: {
            type: String
        },
        departamento: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        dni: {
            type: String,
            unique: true
        },
        foto:{
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
module.exports = mongoose.model("person", PersonScheme)