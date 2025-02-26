const mongoose = require("mongoose");
const PersonScheme = new mongoose.Schema(
    {
        tipoUsuario: {
            type: String,
            enum: ["alumno", "personal", "profesor"],
            default: "alumno"
        },        
        nombre: {
            type: String
        },
        apellidos: {
            type: String
        },
        titulacion: {
            type: String
        },
        tipoTitulacion:{
            type: String,
            enum: ["Grado", "Ciclo superior", "Máster", ""],
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
        },
        modalidad:{
            type: String,
            enum: ["Presencial", "Online"],
            default: "Presencial"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
module.exports = mongoose.model("Person", PersonScheme);
