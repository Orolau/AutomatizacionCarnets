"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { VerificationFormInteract } from "@/app/api/VerificationFormInteract";
import Image from "next/image";

const validationSchema = Yup.object().shape({
    firstNumber: Yup.string(),
    secondNumber: Yup.string(),
    thirdNumber: Yup.string(),
    fourthNumber: Yup.string(),
    fifthNumber: Yup.string(),
    sixthNumber: Yup.string()
});

export default function VerificationForm() {
    const router = useRouter();

    const [verificationResult, setVerificationResult] = useState({
        firstNumber: "",
        secondNumber: "",
        thirdNumber: "",
        fourthNumber: "",
        fifthNumber: "",
        sixthNumber: ""
    });

    const [sendAgain, setSendAgain] = useState(false);

    const handleSubmit = async (values) => {
        const code = `${values.firstNumber}${values.secondNumber}${values.thirdNumber}${values.fourthNumber}${values.fifthNumber}${values.sixthNumber}`;
        const email = localStorage.getItem("email");
        try {
            const response = await VerificationFormInteract(code, email);
            console.log("Código ingresado:", code);
            console.log("Respuesta del backend:", response);

            if (response && response.mail) {
                router.push("./finales/principal").then(() => {
                    setTimeout(() => {
                        window.location.replace("/pages/listaFiltrado");
                    }, 300);
                });
            }
        } catch (err) {
            console.error("Error en la verificación:", err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-300">
            {/* Logo en la esquina superior izquierda */}
            <div className="absolute top-5 left-5">
                <Image src="/images/Logo-U-tad 1.png" alt="U-Tad Logo" width={125} height={75} />
            </div>

            {/* Formulario de verificación */}
            <div className="bg-blue-100 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Codigo de Verificación</h1>
                <p className="text-gray-700 text-base mb-6">
                    Introduce el código de verificación que te acabamos de enviar al correo.
                </p>
                <Formik
                    initialValues={verificationResult}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="space-y-4">
                            <div className="flex justify-center gap-3 mb-4">
                                {["firstNumber", "secondNumber", "thirdNumber", "fourthNumber", "fifthNumber", "sixthNumber"].map(
                                    (name, index) => (
                                        <Field
                                            key={index}
                                            maxLength="1"
                                            name={name}
                                            type="text"
                                            placeholder=""
                                            className="w-10 h-10 text-center text-lg border border-blue-400 rounded-lg bg-white"
                                        />
                                    )
                                )}
                            </div>
                            <ErrorMessage name="firstNumber" component="div" className="text-red-600 text-sm text-center" />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-full font-bold hover:bg-blue-700 transition"
                            >
                                Verificar
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
