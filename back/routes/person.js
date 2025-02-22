const express = require("express");
const { createPerson, getPersonById, updatePerson, deletePerson, getPeople, getPersonByDNI, getPersonByName } = require("../controllers/person.js");

const router = express.Router();

router.get("/", getPeople);
router.post("/", createPerson);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);
router.get("/dni/:dni", getPersonByDNI);
router.get("/name/:nombreCompleto", getPersonByName);

module.exports = router;
