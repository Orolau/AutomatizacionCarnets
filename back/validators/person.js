const { check, param } = require('express-validator');
const validateResults = require("../utils/handleValidator")

const validateCreatePerson = [
    check("tipoUsuario").exists().withMessage("No tipoUsuario").isIn(['alumno', 'personal', 'profesor']).withMessage("tipoUsuario debe ser 'alumno', 'personal', or 'profesor'"),
    check("nombre").exists().withMessage("No nombre").isString().withMessage("Nombre debe ser string"),
    check("apellidos").exists().withMessage("No apellidos").isString().withMessage("Apellidos debe ser string"),
    check("titulacion").exists().withMessage("No titulacion").isString().withMessage("Titulacion debe ser string"),
    check("tipoTitulacion").exists().withMessage("No tipoTitulacion").isIn(['Grado', 'Ciclo superior', 'Máster', '']).withMessage("tipoTitulacion debe ser 'Grado', 'Ciclo superior', 'Máster', o string vacio"),
    check("cargo").exists().withMessage("No cargo").isString().withMessage("Cargo debe ser string"),
    check("departamento").exists().withMessage("No departamento").isString().withMessage("Departamento debe ser string"),
    check("email").exists().withMessage("No email").isEmail().withMessage("Invalid email format"),
    check("dni").exists().withMessage("No dni").matches(/^\d{8}[A-Z]$/).withMessage("DNI debe tener el formato 12345678X"),
    check("foto").optional().isURL().withMessage("Foto debe ser valid URL"),
    check("modalidad").exists().withMessage("No modalidad").isIn(['Presencial', 'Online']).withMessage("Modalidad debe ser 'Presencial' o 'Online'"),
    validateResults
];

const validatePersonName = [
    param("nombreCompleto").exists().withMessage("No nombreCompleto provided").isString().withMessage("nombreCompleto debe ser string"),
    validateResults
];

const validateUploadImage = [
    param("id").exists().withMessage("No id proporcionado").isMongoId().withMessage("MongoDB id inválido"),
    check("file").custom((value, { req }) => {
        if (!req.file) {
            throw new Error("No fichero subido");
        }
        return true;
    }),
    validateResults
];

const validateCreatePeopleWithFile = [
    check("data").isArray({ min: 1 }).withMessage("Data no puede ser un Array vacío"),
    check("data.*.tipoUsuario").optional().isIn(['alumno', 'personal', 'profesor']).withMessage("tipoUsuario must be 'alumno', 'personal', o 'profesor'"),
    check("data.*.nombre").exists().withMessage("Nombre es requerido").isString().withMessage("Nombre debe ser string"),
    check("data.*.apellidos").exists().withMessage("Apellidos es requerido").isString().withMessage("Apellidos debe ser string"),
    check("data.*.titulacion").optional().isString().withMessage("Titulacion debe ser string"),
    check("data.*.tipoTitulacion").optional().isIn(['Grado', 'Ciclo superior', 'Máster', '']).withMessage("tipoTitulacion debe ser 'Grado', 'Ciclo superior', 'Máster', o un string vacío"),
    check("data.*.cargo").optional().isString().withMessage("Cargo debe ser string"),
    check("data.*.departamento").optional().isString().withMessage("Departamento debe ser string"),
    check("data.*.email").exists().withMessage("Email es requerido").isEmail().withMessage("Formato de email inválido"),
    check("data.*.dni").exists().withMessage("DNI es requerido").matches(/^\d{8}[A-Z]$/).withMessage("DNI debe tener el formato 12345678X"),
    check("data.*.foto").optional().isURL().withMessage("Foto debe ser valid URL"),
    check("data.*.modalidad").optional().isIn(['Presencial', 'Online']).withMessage("Modalidad debe ser 'Presencial' o 'Online'"),
    check("data.*.curso").optional().isString().withMessage("Curso debe ser string"),
    validateResults
];

const validatePutEstado = [
    param("dni").exists().withMessage("No dni proporcionado").matches(/^\d{8}[A-Z]$/).withMessage("DNI debe tener el formato 12345678X"),
    check("estadoCarnet").exists().withMessage("No estadoCarnet proporcionado").isIn(['hecho', 'pendiente']).withMessage("estadoCarnet debe ser 'hecho' o 'pendiente"),
    validateResults
];

const validatePersonId = [
    param("id").exists().withMessage("No id proporcionado").isMongoId().withMessage("MongoDB id inválido"),
    validateResults
];
const validatePersonDNI = [
    param("dni").exists().withMessage("No dni proporcionado").matches(/^\d{8}[A-Z]$/).withMessage("DNI debe tener el formato 12345678X"),
    validateResults
];

const validateUpdatePerson = [
    param("id").exists().withMessage("No id provided").isMongoId().withMessage("Invalid MongoDB id"),
    check("tipoUsuario").optional().isIn(['alumno', 'personal', 'profesor']).withMessage("tipoUsuario must be 'alumno', 'personal', or 'profesor"),
    check("nombre").optional().isString().withMessage("Nombre must be a string"),
    check("apellidos").optional().isString().withMessage("Apellidos must be a string"),
    check("titulacion").optional().isString().withMessage("Titulacion must be a string"),
    check("tipoTitulacion").optional().isIn(['Grado', 'Ciclo superior', 'Máster', '']).withMessage("tipoTitulacion must be 'Grado', 'Ciclo superior', 'Máster', or an empty string"),
    check("cargo").optional().isString().withMessage("Cargo must be a string"),
    check("departamento").optional().isString().withMessage("Departamento must be a string"),
    check("email").optional().isEmail().withMessage("Invalid email format"),
    check("dni").optional().matches(/^\d{8}[A-Z]$/).withMessage("DNI must be in the format 12345678X"),
    check("foto").optional().isURL().withMessage("Foto must be a valid URL"),
    check("modalidad").optional().isIn(['Presencial', 'Online']).withMessage("Modalidad must be 'Presencial' or 'Online"),
    validateResults
  ];
  

module.exports = { validateCreatePerson, validateUpdatePerson, validatePersonDNI, validatePersonId , validatePersonName, validateUploadImage, validateCreatePeopleWithFile, validatePutEstado }