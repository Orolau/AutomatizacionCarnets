const express = require("express");
const multer = require("multer");
const { getFilteredPersons, createPerson, createPeopleWithFile, getPersonByDNI, getPersonByName, getPersonById, updatePerson, deletePerson, uploadImageAndUpdatePerson, getPeople } = require("../controllers/person.js");
const authMiddleware = require('../middleware/session.js')

const router = express.Router();
const upload = multer();

router.get("/", getPeople);
router.get("/filtered", getFilteredPersons);
router.post("/", createPerson);
router.post("/upload", createPeopleWithFile);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);
router.get("/dni/:dni", getPersonByDNI);
router.get("/name/:nombreCompleto", getPersonByName);
router.put("/updatePhoto/:id", upload.single("foto"), uploadImageAndUpdatePerson);

module.exports = router;
