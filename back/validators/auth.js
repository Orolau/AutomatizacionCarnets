const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorLogin = [
    check("mail").exists().notEmpty().isEmail(),
    check("passwd").exists().notEmpty().isLength({ min: 8, max: 32 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = { validatorLogin }