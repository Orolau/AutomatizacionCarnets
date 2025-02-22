const mongoose = require('mongoose')

const userModel = new mongoose.Schema(
    {
        mail: {
            type: String,
            unique: true
        },
        passwd: String
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('user', userModel)