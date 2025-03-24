"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { LoginFormInteract } from "@/app/api/LoginFormInteract";
import Image from "next/image";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .required("Este campo es obligatorio")
        .email("El formato es incorrecto"),
    password: Yup.string().required("Este campo es obligatorio"),
});

export default function LoginForm() {
    const router = useRouter();

    const [userInfo] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (values) => {
        const userData = {
            mail: values.email,
            passwd: values.password,
        };
        const respuestaServer = await LoginFormInteract(userData);

        if (respuestaServer === userData.mail) {
            localStorage.setItem("email", userData.mail);
            router.push("../verify");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-300">
            {/* Logo en la esquina superior izquierda */}
            <div className="absolute top-5 left-5">
                <Image src="/images/Logo-U-tad 1.png" alt="U-Tad Logo" width={125} height={75} />
            </div>

            {/* Formulario de inicio de sesión */}
            <div className="bg-blue-100 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>
                <Formik
                    initialValues={userInfo}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="space-y-4">
                            <div className="relative">
                                {/* Icono de correo */}
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Image
                                        src="/images/email-icon.png" // Ruta de la imagen de correo
                                        alt="Correo"
                                        width={20} // Ajusta el tamaño según lo necesites
                                        height={20}
                                    />
                                </div>
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Correo electrónico"
                                    className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                            <div className="relative">
                                {/* Icono de contraseña */}
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Image
                                        src="/images/password-icon.png" // Ruta de la imagen de contraseña
                                        alt="Contraseña"
                                        width={20} // Ajusta el tamaño según lo necesites
                                        height={20}
                                    />
                                </div>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Contraseña"
                                    className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-full font-bold hover:bg-blue-700 transition"
                            >
                                Iniciar sesión
                            </button>
                            <p className="text-gray-600 text-sm cursor-pointer hover:underline">
                                Olvidé la contraseña
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
