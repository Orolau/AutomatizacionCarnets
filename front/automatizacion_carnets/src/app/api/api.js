export async function fetchFilteredPeople(params) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:3005/api/person/filtered?${query}`);
    if (!response.ok) throw new Error("Error al obtener personas filtradas");
    return await response.json();
}

export async function generateAndDownloadLogs() {
    const response = await fetch("http://localhost:3005/api/auth/notify-errors");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al generar los logs");
    return data;
}

export async function fetchOnlinePeople() {
    const response = await fetch("http://localhost:3005/api/person");
    if (!response.ok) throw new Error("Error al obtener las personas");
    const data = await response.json();
    return data.filter(persona => persona.modalidad === "Online");
}

export async function uploadExcelData(data) {
    const response = await fetch("http://localhost:3005/api/person/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });

    if (response.status === 409) {
        throw new Error("No se pueden crear usuarios repetidos");
    }

    if (!response.ok) {
        throw new Error("Error al subir datos del Excel");
    }

    return await response.json();
}

export async function fetchPersonByDni(dni) {
    const response = await fetch(`http://localhost:3005/api/person/${dni}`);

    if (!response.ok) {
        throw new Error("Error al obtener los datos del carnet");
    }

    return await response.json();
}

