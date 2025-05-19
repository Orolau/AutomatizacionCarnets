const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./config/mongo.js");
const router = require("./routes/index.js");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Automatización Carnets",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
    },
    servers: [
      {
        url: "http://localhost:" + (process.env.PORT || 3000),
      },
    ],
  },
  apis: ["./routes/index.js", "./controllers/*.js"], // Asegúrate de que las rutas están bien documentadas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api", router);

const port = process.env.PORT || 3000;

const server =app.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port);
  console.log(`Swagger disponible en http://localhost:${port}/api-docs`);
  dbConnect();
});
module.exports = {app, server};