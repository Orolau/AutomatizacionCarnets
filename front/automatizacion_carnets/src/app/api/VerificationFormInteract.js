"use server";

export async function VerificationFormInteract(code, token) {

    try {
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/validation", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ code }),
        });

        console.log("verificando");
        console.log(response);
        const respuesta = await response.json();
        return respuesta;

    } catch (error) {
        console.error('ERROR: no se pudo enviar la información', error);
    }
}