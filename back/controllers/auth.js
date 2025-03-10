const userModel = require("../models/user")
const { handleHttpError } = require("../utils/handleError.js")
const { tokenSign } = require("../utils/handleJwt.js")
const { matchedData } = require('express-validator')
const { encrypt, compare } = require("../utils/handlePassword")

const loginCtrl = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        req = matchedData(req)
        const user = await userModel.findOne({ mail: req.mail }).select("passwd mail")
        console.log(req)
        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }
        const hashPasswd = user.passwd;
        const check = await compare(req.passwd, hashPasswd)
        if (!check) {
            handleHttpError(res, "INVALID_PASSWORD", 401)
            return
        }
        user.set("passwd", undefined, { strict: false }) //Si no queremos que se muestre el hash en la respuesta
        const data = {
            token: await tokenSign(user),
            user
        }
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_LOGIN_USER")
    }
}

module.exports = { loginCtrl }