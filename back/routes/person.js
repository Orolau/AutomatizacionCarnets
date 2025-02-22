const express = require("express");
const { getPersons, createPerson, getPersonById, updatePerson, deletePerson } = require("../controllers/person.js");

const router = express.Router();

router.get("/", getPersons);
router.post("/", createPerson);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

module.exports = router;
