const express = require("express")
const { loginCtrl } = require('../controllers/auth')
const { validatorLogin } = require('../validators/auth')
const router = express.Router()

router.post("/login", validatorLogin, loginCtrl)

module.exports = router