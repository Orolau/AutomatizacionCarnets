const { MongoClient } = require("mongodb");
require("dotenv").config(); // Cargar variables de entorno

const uri = process.env.MONGO_URI; // Tomar la URI desde el .env

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("carnetAppDB"); // Nombre de la base de datos
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error);
    }
}

function getDB() {
    if (!db) {
        throw new Error("❌ La base de datos no está conectada");
    }
    return db;
}

module.exports = { connectDB, getDB };
