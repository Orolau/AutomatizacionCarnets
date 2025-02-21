const express = require('express')
const cors = require('cors')
require('dotenv').config()
const userRouter = require('./routes/user.js')
//const { dbConnect, getDB } = require("./config/database");
const dbConnect = require('./config/database.js')

/*async function fetchPeople() {
    await dbConnect(); // Conectar a la base de datos

    const db = getDB(); // Obtener la base de datos
    const peopleCollection = db.collection("people"); // Obtener la colección

    try {
        const people = await peopleCollection.find().toArray(); // Obtener todos los documentos
        console.log("📄 Datos obtenidos de la colección 'people':", people);
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
    }
}*/

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', userRouter)

dbConnect();
//fetchPeople();
