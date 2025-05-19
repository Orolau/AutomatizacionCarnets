import axios from "axios";

export const LoginFormInteract = async ({ mail, passwd }) => {
    try {
        /*const response = await axios.get("http://localhost:3005/api/user");

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
        }*/
        const response = await fetch('http://localhost:3005/api/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mail, passwd })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al iniciar sesión");
        }
        const data = await response.json();

        const updateResponse = await axios.put(`http://localhost:3005/api/user/verify/${encodeURIComponent(mail)}`);
        return data;
    } catch (error) {
        console.error("Error en la autenticación:", error.message);
        throw error;
    }
};