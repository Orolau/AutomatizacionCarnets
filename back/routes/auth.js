const express = require("express");
const { loginCtrl } = require("../controllers/auth");
const { validatorLogin } = require("../validators/auth");
const { ErroresToMail } = require("../controllers/errors");

const router = express.Router();

router.post("/login", validatorLogin, loginCtrl);
router.get("/notify-errors", ErroresToMail);

module.exports = router;