"use server";

export async function LoginFormInteract({ email, password }) {

    try {
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const respuesta = await response.json();
        return respuesta;

    } catch (error) {
        console.error('ERROR: no se pudo enviar la información', error);
    }
}