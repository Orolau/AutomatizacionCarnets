const mongoose = require('mongoose')

const userModel = new mongoose.Schema(
    {
        mail: {
            type: String,
            unique: true
        },
        passwd: String,
        verificando: {
            type: Boolean,
            default: false
        },
        verifyCode: Number
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('user', userModel)