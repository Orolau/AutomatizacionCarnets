const { validationResult } = require("express-validator")

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw()
        next()
    } catch (err) {
        console.log(err)
        res.status(403);
        res.json({ error: err.array() })
    }
}
module.exports = validateResults