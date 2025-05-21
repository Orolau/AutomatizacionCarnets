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
        curso:{
            type: String,
            enum: ["1º", "2º", "3º", "4º", "5º", ""],
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
        },
        estadoCarnet: {
            type: String,
            enum: ["hecho", "pendiente"],
            required: true,
            default: "pendiente"
        },
        numeroCarnets: {
            type: Number,
            default: 0
        },
        direccion:{
            type: String,
        },
        postal:{
            type: String,
        },
        provincia:{
            type: String,
        },
        poblacion:{
            type: String,
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
)
module.exports = mongoose.model("Person", PersonScheme);
