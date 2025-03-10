const express = require("express");
const router = express.Router();

const { getTodos, getTerminados, putEstado } = require("../controllers/estado");

router.get("/", getTodos);
router.get("/hecho", getTerminados);
router.put("/:dni", putEstado);


module.exports = router;
