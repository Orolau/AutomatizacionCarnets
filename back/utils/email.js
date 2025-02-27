const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendVerificationEmail = async (to, code) => {
    const mailOptions = {
        from: '"Your App" <carnetsutad@gmail.com>',
        to,
        subject: "Tu código de verificación",
        text: `Tu código de verificación es: ${code}`,
    };

    try {
        console.log("Enviando correo a:", to, "con código:", code);
        const info = await transporter.sendMail(mailOptions);
        console.log("Email enviado: %s", info.messageId);
    } catch (error) {
        console.error("Error al enviar email:", error);
        throw error;
    }
};

module.exports = sendVerificationEmail;