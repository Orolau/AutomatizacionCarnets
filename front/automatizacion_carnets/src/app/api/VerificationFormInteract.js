import axios from "axios";

export const VerificationFormInteract = async (code, email) => {

    try {
        const response = await axios.put("http://localhost:3005/api/user/verified", { email, code });
        return response.data;
    } catch (error) {
        console.error("Error en de verificación:", error.message);
        throw error;
    }
};