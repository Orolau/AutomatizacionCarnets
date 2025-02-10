const { connectDB, getDB } = require("./database");

async function fetchPeople() {
    await connectDB(); // Conectar a la base de datos

    const db = getDB(); // Obtener la base de datos
    const peopleCollection = db.collection("people"); // Obtener la colección

    try {
        const people = await peopleCollection.find().toArray(); // Obtener todos los documentos
        console.log("📄 Datos obtenidos de la colección 'people':", people);
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
    }
}

fetchPeople();
