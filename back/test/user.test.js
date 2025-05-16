const request = require("supertest");
const { app, server } = require("../index.js");
const mongoose = require('mongoose');
const { userModel, personModel } = require('../models/index.js')
const emailUtils = require("../utils/email");
const { encrypt } = require("../utils/handlePassword");

jest.mock("../utils/email"); // mock para sendVerificationEmail

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    userModel.deleteMany({})
}, 7000);

describe("User API", () => {
    beforeEach(async () => {
        await userModel.deleteMany({});
        emailUtils.sendVerificationEmail.mockClear();
    });

    describe("GET /api/user", () => {
        test("debería retornar la lista de usuarios", async () => {
            // Insertar usuarios de prueba
            await userModel.create([
                { mail: "a@a.com", passwd: "password123" },
                { mail: "b@b.com", passwd: "password456" },
            ]);

            const res = await request(app).get("/api/user");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBe(2);
            expect(res.body.data[0]).toHaveProperty("mail", "a@a.com");
        });
    });

    describe("PUT /api/user/verify/:email", () => {
        test("debería actualizar verificando y enviar código", async () => {
            await userModel.create({ mail: "test@mail.com", passwd: "12345678" });

            const res = await request(app).put("/api/user/verify/test@mail.com");

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("verificando", true);
            expect(res.body.verifyCode).toBeGreaterThanOrEqual(100000);
            expect(res.body.verifyCode).toBeLessThanOrEqual(999999);
            expect(emailUtils.sendVerificationEmail).toHaveBeenCalledWith(
                "test@mail.com",
                res.body.verifyCode
            );
        });

        test("debería devolver 404 si no encuentra usuario", async () => {
            const res = await request(app).put("/api/user/verify/nouser@mail.com");

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("message", "Usuario no encontrado");
        });
    });

    describe("PUT /api/user/verified", () => {
        test("debería verificar usuario con código correcto", async () => {
            const user = await userModel.create({
                mail: "verify@mail.com",
                passwd: "password123",
                verificando: true,
                verifyCode: 123456,
            });

            const res = await request(app)
                .put("/api/user/verified")
                .send({ email: "verify@mail.com", code: 123456 });

            expect(res.statusCode).toBe(200);
            expect(res.body.verificando).toBe(false);
            expect(res.body.verifyCode).toBe(0);
        });

        test("debería devolver 404 con código incorrecto o usuario no verificando", async () => {
            await userModel.create({
                mail: "wrong@mail.com",
                passwd: "password123",
                verificando: false,
                verifyCode: 0,
            });

            const res = await request(app)
                .put("/api/user/verified")
                .send({ email: "wrong@mail.com", code: 999999 });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toMatch(/email o el código de verificación son incorrectos/i);
        });

        test("debería devolver 500 si ocurre error interno", async () => {
            // Mock para forzar error
            jest.spyOn(userModel, "findOneAndUpdate").mockImplementation(() => {
                throw new Error("Error forzado");
            });

            const res = await request(app)
                .put("/api/user/verified")
                .send({ email: "test@mail.com", code: 123456 });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("error", "Error forzado");

            userModel.findOneAndUpdate.mockRestore();
        });
    });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  test("debería loguear correctamente y retornar token y user", async () => {
    const mail = "test@mail.com";
    const rawPassword = "mypassword123";
    const hashedPassword = await encrypt(rawPassword);

    await userModel.create({
      mail,
      passwd: hashedPassword,
    });

    const res = await request(app).post("/api/auth/login").send({
      mail,
      passwd: rawPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.mail).toBe(mail);
    expect(res.body.user).not.toHaveProperty("passwd");
  });

  test("debería retornar 404 si el usuario no existe", async () => {
    const res = await request(app).post("/api/auth/login").send({
      mail: "nonexistent@mail.com",
      passwd: "whatever123",
    });

    expect(res.statusCode).toBe(404);
  });

  test("debería retornar 401 si la contraseña es incorrecta", async () => {
    const mail = "test@mail.com";
    const hashedPassword = await encrypt("correctpassword");

    await userModel.create({ mail, passwd: hashedPassword });

    const res = await request(app).post("/api/auth/login").send({
      mail,
      passwd: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  test("debería retornar 403 si ocurre un error inesperado", async () => {
    // Simular error en userModel.findOne
    jest.spyOn(userModel, "findOne").mockImplementation(() => {
      throw new Error("fallo inesperado");
    });

    const res = await request(app).post("/api/auth/login").send({
      mail: "fail@mail.com",
      passwd: "whatever",
    });

    expect(res.statusCode).toBe(403);

    userModel.findOne.mockRestore(); // limpiar mock
  });
});

jest.mock("../models/person"); // mock del modelo
jest.mock("../utils/email");   // mock del envío de emails

describe("GET /api/auth/notify-errors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debería enviar correo a personas con datos incompletos y email válido", async () => {
    personModel.find.mockResolvedValue([
      {
        nombre: "Juan",
        apellidos: "Pérez",
        dni: "12345678A",
        titulacion: "",
        direccion: "Calle Falsa",
        foto: "foto.jpg",
        modalidad: "Presencial",
        email: "juan@example.com",
      },
      {
        nombre: "Ana",
        apellidos: "López",
        dni: "23456789B",
        titulacion: "Ingeniería",
        direccion: "Calle Verdadera",
        foto: "foto2.jpg",
        modalidad: "Online",
        email: "ana@example.com",
      },
      {
        nombre: "SinCorreo",
        apellidos: "SinApellido",
        dni: "99999999X",
        titulacion: "",
        direccion: "",
        foto: "",
        modalidad: "",
        email: "",
      },
    ]);

    emailUtils.sendEmail.mockResolvedValue();

    const res = await request(app).get("/api/auth/notify-errors");

    expect(res.statusCode).toBe(200);
    expect(emailUtils.sendEmail).toHaveBeenCalledTimes(1); // Solo Juan tiene datos incompletos y correo válido
    expect(res.body.message).toContain("Correos enviados a 1 usuarios");
    expect(res.body.logs).toContain("Enviando correo a: juan@example.com");
  });

  test("no debería enviar correos si todos los datos están completos", async () => {
    personModel.find.mockResolvedValue([
      {
        nombre: "Ana",
        apellidos: "López",
        dni: "23456789B",
        titulacion: "Ingeniería",
        direccion: "Calle Verdadera",
        foto: "foto.jpg",
        modalidad: "Presencial",
        email: "ana@example.com",
      },
    ]);

    const res = await request(app).get("/api/auth/notify-errors");

    expect(res.statusCode).toBe(200);
    expect(emailUtils.sendEmail).not.toHaveBeenCalled();
    expect(res.body.message).toContain("Correos enviados a 0 usuarios");
  });

  test("no debería enviar correos a usuarios sin email válido", async () => {
    personModel.find.mockResolvedValue([
      {
        nombre: "Pedro",
        apellidos: "SinEmail",
        dni: "88888888T",
        titulacion: "",
        direccion: "",
        foto: "",
        modalidad: "",
        email: "", // no válido
      },
    ]);

    const res = await request(app).get("/api/auth/notify-errors");

    expect(res.statusCode).toBe(200);
    expect(emailUtils.sendEmail).not.toHaveBeenCalled();
    expect(res.body.message).toContain("Correos enviados a 0 usuarios");
  });

  test("debería retornar 500 si ocurre un error inesperado", async () => {
    personModel.find.mockRejectedValue(new Error("Error en la BD"));

    const res = await request(app).get("/api/auth/notify-errors");

    expect(res.statusCode).toBe(500);
  });
});

afterAll(async () => {
    server.close()
    await mongoose.connection.close()
});