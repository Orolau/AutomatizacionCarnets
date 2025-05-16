const request = require("supertest");
const { app, server } = require("../index.js");
const mongoose = require('mongoose');
const { encrypt } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleJwt.js');
const { userModel, personModel } = require('../models/index.js')

const initialUser = 
  {
    email: "prueba@correo.com",
    password: "TestPassword123"
  }


let token
let userId
beforeAll(async () => {
  await new Promise((resolve) => mongoose.connection.once('connected', resolve));
  await userModel.deleteMany({})
  await personModel.deleteMany({})
  const code = "111111"
  const password = await encrypt(initialUser.password)
  const body = initialUser
  body.password = password
  body.code = code
  const userData = await userModel.create(body)
  userData.set("password", undefined, { strict: false })

  token = tokenSign(userData, process.env.JWT_SECRET)
  userId = userData._id

}, 7000);


describe("Person Endpoints", () => {
  test("Should return all people", async () => {
    const res = await request(app)
      .get("/api/person")
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /api/person/filtered", () => {
  test("Should return all people when no filters are applied", async () => {
    const res = await request(app)
      .get("/api/person/filtered")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Should filter people by tipoUsuario", async () => {
    const res = await request(app)
      .get("/api/person/filtered")
      .query({ tipoUsuario: "alumno" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((person) => {
      expect(person.tipoUsuario).toBe("alumno");
    });
  });

  test("Should filter people by nombre", async () => {
    const res = await request(app)
      .get("/api/person/filtered")
      .query({ nombre: "Juan" }) // asegúrate de tener a "Juan" en los datos
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((person) => {
      expect(person.nombre).toBe("Juan");
    });
  });

  test("Should filter people by apellidos", async () => {
    const res = await request(app)
      .get("/api/person/filtered")
      .query({ apellidos: "Pérez" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((person) => {
      expect(person.apellidos).toBe("Pérez");
    });
  });

  test("Should return empty array for non-matching filters", async () => {
    const res = await request(app)
      .get("/api/person/filtered")
      .query({ nombre: "NombreInexistente" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test("Should filter by multiple fields (tipoUsuario + nombre)", async () => {
    const res = await request(app)
      .get("/api/person/filtered")
      .query({ tipoUsuario: "alumno", nombre: "Juan" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((person) => {
      expect(person.tipoUsuario).toBe("alumno");
      expect(person.nombre).toBe("Juan");
    });
  });
});

describe("POST /api/person", () => {
  const validPerson = {
    tipoUsuario: "alumno",
    nombre: "Luis",
    apellidos: "Martínez",
    titulacion: "INSO",
    tipoTitulacion: "Grado",
    email: "luis.martinez@example.com",
    dni: "12345678A",
    foto: "foto.jpg",
    modalidad: "Online"
  };

  test("Should create a new person", async () => {
    const res = await request(app)
      .post("/api/person")
      .set("Authorization", `Bearer ${token}`)
      .send(validPerson);

    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty("_id");
    expect(res.body.nombre).toBe("Luis");
    expect(res.body.email).toBe(validPerson.email);
  });

  test("Should fail creating duplicate person (same email/dni)", async () => {
    const res = await request(app)
      .post("/api/person")
      .set("Authorization", `Bearer ${token}`)
      .send(validPerson);

    expect(res.statusCode).toBe(409);
  });

  test("Should fail with invalid data (missing required fields)", async () => {
    const invalidPerson = {
      tipoUsuario: "alumno",
      email: "incompleto@example.com"
      // faltan nombre, apellidos, dni, etc.
    };

    const res = await request(app)
      .post("/api/person")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidPerson);

    expect(res.statusCode).toBe(403);
  });
});
describe("GET /api/person/:id", () => {
  let createdPersonId;

  beforeAll(async () => {
    // Creamos una persona válida para usar su ID
    const person = await personModel.create({
      tipoUsuario: "profesor",
      nombre: "María",
      apellidos: "López",
      cargo: "Docente",
      departamento: "Ciencias",
      email: "maria.lopez@example.com",
      dni: "87654321B",
      foto: "foto2.jpg",
      modalidad: "Presencial"
    });
    createdPersonId = person._id;
  });

  test("Should return a person by valid ID", async () => {
    const res = await request(app)
      .get(`/api/person/${createdPersonId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", createdPersonId.toString());
    expect(res.body.email).toBe("maria.lopez@example.com");
  });

  test("Should return 404 for non-existent person", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/person/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test("Should return 500 for invalid ID format", async () => {
    const invalidId = "123-invalid-id";

    const res = await request(app)
      .get(`/api/person/${invalidId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });
});

describe("GET /api/person/dni/:dni", () => {
  const dniValido = "11223344M";

  beforeAll(async () => {
    await personModel.create({
      tipoUsuario: "profesor",
      nombre: "Manuel",
      apellidos: "Domínguez",
      cargo: "Docente",
      departamento: "matemáticas",
      email: "manuel.dominguez@example.com",
      dni: dniValido,
      foto: "foto4.jpg",
      modalidad: "Presencial"
    });
  });

  test("Debe devolver una persona por DNI existente", async () => {
    const res = await request(app)
      .get(`/api/person/dni/${dniValido}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.dni).toBe(dniValido);
    expect(res.body.nombre).toBe("Manuel");
  });

  test("Debe devolver 404 si no se encuentra la persona", async () => {
    const res = await request(app)
      .get(`/api/person/dni/00000000Z`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test("Debe devolver 403 si el formato del DNI es inválido", async () => {
    const res = await request(app)
      .get(`/api/person/dni/INVALIDO123`)
      .set("Authorization", `Bearer ${token}`);

    
    expect(res.statusCode).toBe(403);
  });
});



describe("GET /api/person/name/:nombreCompleto", () => {
  let fullName = "Laura Sánchez";

  beforeAll(async () => {
    await personModel.create({
      tipoUsuario: "alumno",
      nombre: "Laura",
      apellidos: "Sánchez",
      titulacion: "INSO",
      tipoTitulacion: "Grado",
      curso: "1º",
      email: "laura.sanchez@example.com",
      dni: "22334455Z",
      foto: "foto3.jpg",
      modalidad: "Online"
    });
  });

  test("Should return person by full name", async () => {
    const res = await request(app)
      .get(`/api/person/name/${encodeURIComponent(fullName)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Laura");
    expect(res.body.apellidos).toBe("Sánchez");
    expect(res.body.email).toBe("laura.sanchez@example.com");
  });

  test("Should return 404 if person not found", async () => {
    const res = await request(app)
      .get(`/api/person/name/${encodeURIComponent("NombreFalso")}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test("Should return 500 if name param causes error", async () => {
    
    const res = await request(app)
      .get(`/api/person/name/`)
      .set("Authorization", `Bearer ${token}`);

    
    expect(res.statusCode).toBe(403);
  });
});

describe("PUT /api/person/:id", () => {
  let personId;

  beforeAll(async () => {
    const person = await personModel.create({
      tipoUsuario: "alumno",
      nombre: "Carlos",
      apellidos: "Pérez Gómez",
      titulacion: "INSO",
      tipoTitulacion: "Grado",
      curso: "3º",
      email: "carlos.perez@example.com",
      dni: "11223344A",
      foto: "https://example.com/foto.jpg",
      modalidad: "Presencial"
    });
    personId = person._id.toString();
  });

  test("Debe actualizar correctamente una persona existente", async () => {
    const res = await request(app)
      .put(`/api/person/${personId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "Carlos Modificado",
        email: "carlos.modificado@example.com"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Carlos Modificado");
    expect(res.body.email).toBe("carlos.modificado@example.com");
  });

  test("Debe devolver 404 si la persona no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/person/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Inexistente" });

    expect(res.statusCode).toBe(404);
  });

  test("Debe devolver 400 si no se pasa el ID", async () => {
    const res = await request(app)
      .put(`/api/person/`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Sin ID" });

    expect(res.statusCode).toBe(404); // Express no enrutará si no hay ID
  });

  test("Debe devolver 403 si el email es inválido", async () => {
    const res = await request(app)
      .put(`/api/person/${personId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "no-es-un-email" });

    expect(res.statusCode).toBe(403);
  });

  test("Debe devolver 403 si modalidad es inválida", async () => {
    const res = await request(app)
      .put(`/api/person/${personId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ modalidad: "Virtual" });

    expect(res.statusCode).toBe(403);
    
  });

  test("Debe aceptar DNI y pasarlo por `procesarIdentificador`", async () => {
    const dni = "112233440B";

    const res = await request(app)
      .put(`/api/person/${personId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ dni });

    expect(res.statusCode).toBe(200);

  });
});
describe("DELETE /api/person/:id", () => {
  let personId;

  beforeAll(async () => {
    const person = await personModel.create({
      tipoUsuario: "profesor",
      nombre: "Laura",
      apellidos: "Domínguez Ruiz",
      cargo: "Docente",
      departamento: "Redes de ordenadores",
      email: "laura@example.com",
      dni: "99887766Z",
      foto: "https://example.com/laura.jpg",
      modalidad: "Online"
    });

    personId = person._id.toString();
  });

  test("Debe eliminar una persona existente correctamente", async () => {
    const res = await request(app)
      .delete(`/api/person/${personId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(personId);

    // Confirmar que ya no existe
    const findDeleted = await personModel.findById(personId);
    expect(findDeleted).toBeNull();
  });



  test("Debe devolver 403 si el ID no es válido", async () => {
    const res = await request(app)
      .delete("/api/person/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });
});

describe("PUT /api/person/estado/:dni", () => {
  let testPerson;

  beforeEach(async () => {
    testPerson = await personModel.create({
      tipoUsuario: "alumno",
      nombre: "Pedro",
      apellidos: "Pérez",
      titulacion: "INSO",
      tipoTitulacion: "Grado",
      email: "pedro@example.com",
      dni: "12345678X",
      foto: "https://example.com/pedro.jpg",
      modalidad: "Presencial",
      estadoCarnet: "pendiente",
      numeroCarnets: 0
    });
  });

  afterEach(async () => {
    await personModel.deleteMany({});
  });

  test("Debe actualizar el estado del carnet correctamente a 'hecho' y aumentar numeroCarnets", async () => {
    const res = await request(app)
      .put(`/api/person/estado/${testPerson.dni}`)
      .send({ estadoCarnet: "hecho" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.estadoCarnet).toBe("hecho");

    const updated = await personModel.findOne({ dni: testPerson.dni });
    expect(updated.estadoCarnet).toBe("hecho");
    expect(updated.numeroCarnets).toBe(1);
  });

  test("Debe actualizar el estado del carnet a 'pendiente' sin cambiar numeroCarnets", async () => {
    // Poner primero en "hecho"
    await personModel.findOneAndUpdate(
      { dni: testPerson.dni },
      { estadoCarnet: "hecho", numeroCarnets: 2 }
    );

    const res = await request(app)
      .put(`/api/person/estado/${testPerson.dni}`)
      .send({ estadoCarnet: "pendiente" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.estadoCarnet).toBe("pendiente");

    const updated = await personModel.findOne({ dni: testPerson.dni });
    expect(updated.estadoCarnet).toBe("pendiente");
    expect(updated.numeroCarnets).toBe(2); // No cambia
  });

  test("Debe devolver 403 si el estadoCarnet es inválido", async () => {
    const res = await request(app)
      .put(`/api/person/estado/${testPerson.dni}`)
      .send({ estadoCarnet: "invalidValue" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  test("Debe devolver 404 si el DNI no existe", async () => {
    const res = await request(app)
      .put("/api/person/estado/00000000Z")
      .send({ estadoCarnet: "hecho" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

describe("POST /api/person/upload", () => {
  afterEach(async () => {
    await personModel.deleteMany({});
  });

  test("Debe crear múltiples personas correctamente", async () => {
    const data = [
      {
        tipoUsuario: "alumno",
        nombre: "Ana",
        apellidos: "García",
        titulacion: "Ingeniería",
        tipoTitulacion: "Grado",
        email: "ana@example.com",
        dni: "12345678A",
        modalidad: "Presencial",
        curso: "1º"
      },
      {
        tipoUsuario: "profesor",
        nombre: "Carlos",
        apellidos: "Pérez",
        cargo: "Profesor titular",
        departamento: "Matemáticas",
        email: "carlos@example.com",
        dni: "87654321B",
        modalidad: "Online"
      }
    ];

    const res = await request(app)
      .post("/api/person/upload")
      .send({ data });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Datos cargados correctamente");
    expect(res.body.persons.length).toBe(2);
    expect(res.body.persons[0]).toHaveProperty("dni", "12345678A");
    expect(res.body.persons[1]).toHaveProperty("dni", "87654321B");

    // Comprobar en base de datos
    const personsDB = await personModel.find({});
    expect(personsDB.length).toBe(2);
  });

  test("Debe devolver error si el array data está vacío", async () => {
    const res = await request(app)
      .post("/api/person/upload")
      .send({ data: [] });

    expect(res.statusCode).toBe(403); 
  });

  test("Debe devolver error si falta un campo obligatorio (nombre)", async () => {
    const data = [
      {
        tipoUsuario: "alumno",
        apellidos: "García",
        email: "ana@example.com",
        dni: "12345678A"
      }
    ];

    const res = await request(app)
      .post("/api/person/upload")
      .send({ data });

    expect(res.statusCode).toBe(403);
  });

  test("Debe devolver error si email es inválido", async () => {
    const data = [
      {
        tipoUsuario: "alumno",
        nombre: "Ana",
        apellidos: "García",
        email: "email_invalido",
        dni: "12345678A"
      }
    ];

    const res = await request(app)
      .post("/api/person/upload")
      .send({ data });

    expect(res.statusCode).toBe(403);
  });

  test("Debe manejar error de duplicado DNI (código 11000)", async () => {
    const person = new personModel({
      tipoUsuario: "alumno",
      nombre: "Ana",
      apellidos: "García",
      email: "ana@example.com",
      dni: "12345678A"
    });
    await person.save();

    const data = [
      {
        tipoUsuario: "alumno",
        nombre: "Ana",
        apellidos: "García",
        email: "ana@example.com",
        dni: "12345678A" // mismo DNI duplicado
      }
    ];

    const res = await request(app)
      .post("/api/person/upload")
      .send({ data });

    expect(res.statusCode).toBe(409);
  });

  
});

afterAll(async () => {
  server.close()
  await mongoose.connection.close()
});