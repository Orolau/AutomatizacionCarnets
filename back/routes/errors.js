const express = require("express");
const { getErroresPersonas, enviarCorreosCamposFaltantes  } = require("../controllers/errors");

const router = express.Router();

router.get("/errores-personas", getErroresPersonas);
router.get("/correo-personas", enviarCorreosCamposFaltantes);

module.exports = router;
