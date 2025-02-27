const { userModel } = require('../models/index.js')
const sendVerificationEmail = require('../utils/email.js');

const getItems = async (req, res) => {
    const data = await userModel.find({});
    console.log(data)
    res.send({ data });
}

const updateVerifying = async (req, res) => {

    const email = req.params.email;
    console.log(email)
    const code = Math.floor(Math.random() * 900000) + 100000;
    const data = await userModel.findOneAndUpdate(
        { mail: email },
        { $set: { verificando: true, verifyCode: code } },
        { new: true },
    );
    if (!data) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log("Datos updateVerifying:", data)
    await sendVerificationEmail(email, code);
    res.json(data)
}

const updateVerified = async (req, res) => {
    try {
        const { email, code } = req.body;
        const numericCode = Number(code);

        const data = await userModel.findOneAndUpdate(
            { mail: email, verifyCode: numericCode, verificando: true },
            { $set: { verificando: false, verifyCode: 0 } },
            { new: true }
        );

        if (!data) {
            return res.status(404).json({ message: 'El email o el código de verificación son incorrectos, o el usuario no se encuentra en proceso de verificación' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

module.exports = { getItems, updateVerifying, updateVerified }