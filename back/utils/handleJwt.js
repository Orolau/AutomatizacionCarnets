const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

const tokenSign = (user) => {
    const sign = jwt.sign({
        _id: user._id,
    },
        JWT_SECRET,
        {
            expiresIn: "24h"
        }
    )

    return sign
}

const verifyToken = (tokenJwt) => {
    try {
        console.log("clave secreta :", JWT_SECRET)
        return jwt.verify(tokenJwt, JWT_SECRET)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { tokenSign, verifyToken }