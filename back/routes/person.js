const express = require("express");

const {getFilteredPersons, createPerson, getPersonByDNI, getPersonByName, getPersonById, updatePerson, deletePerson, uploadImageAndUpdatePerson, createPeopleWithFile, getPeople, putEstado } = require("../controllers/person.js");
const { validatePersonId, validateCreatePerson, validatePersonDNI, validatePersonName, validateCreatePeopleWithFile, validatePutEstado, validateUpdatePerson } = require("../validators/person.js");
const {uploadMiddlewareMemory} = require('../utils/handleStorage.js');
const authMiddleware = require("../middleware/session.js");

const router = express.Router();


router.get("/", getPeople);
router.get("/filtered",  getFilteredPersons)
router.post("/", validateCreatePerson, createPerson);
router.post("/upload", validateCreatePeopleWithFile, createPeopleWithFile);
router.get("/:id", validatePersonId, getPersonById);
router.put("/:id", validateUpdatePerson, updatePerson);
router.delete("/:id",validatePersonId, deletePerson);
router.get("/dni/:dni",  validatePersonDNI, getPersonByDNI);
router.get("/name/:nombreCompleto", validatePersonName, getPersonByName);
router.put("/updatePhoto/:id", uploadMiddlewareMemory.single("foto"), uploadImageAndUpdatePerson);
router.put("/dni/:dni", validatePutEstado, putEstado);



module.exports = router;
