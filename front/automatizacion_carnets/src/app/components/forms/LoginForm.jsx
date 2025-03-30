"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "@/app/styles/LoginForm.css";
import { useRouter } from "next/navigation";
import { LoginFormInteract } from "@/app/api/LoginFormInteract";
import crypto from "crypto";
//import Cookies from 'js-cookie';

/*const generarMD5 = (password) => {
    return crypto.createHash("md5").update(password).digest("hex");
};*/

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .required("Este campo es obligatorio")
        .email("El formato es incorrecto"),
    password: Yup.string().required("Este campo es obligatorio"),
});

export default function LoginForm() {
    const router = useRouter();

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (values) => {
        console.log("Hola");
        const userData = {
            mail: values.email,
            passwd: values.password,
        };
        console.log(userData.password);
        const respuestaServer = await LoginFormInteract(userData);
        console.log(respuestaServer);
        console.log(values);

        if (respuestaServer.user.mail === userData.mail) {
            localStorage.setItem("email", userData.mail);
            console.log("EMAIL: ", localStorage.getItem("email"))
            localStorage.setItem('tokenLogin', respuestaServer.token);
            console.log("TOKEN: ", sessionStorage.getItem("tokenLogin"))
            //Cookies.set('authToken', respuestaServer.token, { expires: 1 });
            /*const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 1);
            document.cookie = `authToken=${respuestaServer.token}; path=/; samesite=strict; expires=${expirationDate.toUTCString()}`;*/

            router.push("./pages/verify");
        }
    };

    return (
        <div className="p-4 bg-white text-black min-h-screen flex items-center justify-center">
            <div className="p-6 bg-blue-200 rounded-xl shadow-lg w-full max-w-md">
                <Formik
                    initialValues={userInfo}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="flex flex-col">
                            <h1 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                                Login to your account
                            </h1>
                            <div className="mb-4">
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-2 border border-blue-400 rounded-lg bg-white"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                            <div className="mb-4">
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full p-2 border border-blue-400 rounded-lg bg-white"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-lg mt-2 hover:bg-blue-700 transition"
                            >
                                Sign in with email
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
