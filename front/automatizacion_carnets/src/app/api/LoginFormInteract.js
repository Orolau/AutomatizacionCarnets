import axios from "axios";

export const LoginFormInteract = async ({ email, passwordHash }) => {
    try {
        const response = await axios.get("http://localhost:3005/api/user");
        console.log("Respuesta de la API:", response.data);

        const usuarios = Array.isArray(response.data.data) ? response.data.data : [];

        if (usuarios.length === 0) {
            throw new Error("No hay usuarios en la base de datos");
        }

        const usuarioEncontrado = usuarios.find(user => user.mail === email);

        if (!usuarioEncontrado) {
            throw new Error("Usuario no encontrado");
        }

        if (usuarioEncontrado.passwd.trim() !== passwordHash.trim()) {
            throw new Error("Contraseña incorrecta");
        }

        return usuarioEncontrado.mail;
    } catch (error) {
        console.error("Error en la autenticación:", error.message);
        throw error;
    }
};