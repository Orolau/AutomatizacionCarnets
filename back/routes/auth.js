const express = require("express");
const { loginCtrl, verify } = require("../controllers/auth");
const { validatorLogin } = require("../validators/auth");
const { ErroresToMail } = require("../controllers/errors");

const router = express.Router();

router.post("/login", validatorLogin, loginCtrl);
router.get("/notify-errors", ErroresToMail);
router.get("/verifyToken", verify)

module.exports = router;