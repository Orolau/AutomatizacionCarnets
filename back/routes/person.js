const express = require("express");
const { getPersons, getFilteredPersons, createPerson, getPersonById, updatePerson, deletePerson } = require("../controllers/person.js");

const router = express.Router();

router.get("/", getPersons);
router.get("/filtered", getFilteredPersons)
router.post("/", createPerson);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

module.exports = router;
