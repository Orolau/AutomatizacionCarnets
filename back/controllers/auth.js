const userModel = require("../models/user")
const { handleHttpError } = require("../utils/handleError.js")
const { tokenSign, verifyToken } = require("../utils/handleJwt.js")
const { matchedData } = require('express-validator')
const { encrypt, compare } = require("../utils/handlePassword")

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Hace el login del user
 *     description: Comprueba que las credenciales de usuario son correctas y logea el user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *               passwd:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lista de users obtenida correctamente
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user: 
 *                   type: object
 *                   properties: 
 *                     _id:
 *                       type: string
 *                     mail:
 *                       type: string
 *       401:
 *         description: contraseña incorrecta.
 *         content:
 *           test/html:
 *             schema:
 *               type: string
 */

const loginCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const user = await userModel.findOne({ mail: req.mail }).select("passwd mail")
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
        user.set("passwd", undefined, { strict: false })
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

const verify = async (req, res) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
        return res.status(401).json({ valid: false, msg: "Token ausente" });
    }
    try {
        const decoded = verifyToken(token);
        return res.status(200).json({ valid: true, user: decoded });
    } catch {
        return res.status(401).json({ valid: false, msg: "Token inválido" });
    }
}

module.exports = { loginCtrl, verify }