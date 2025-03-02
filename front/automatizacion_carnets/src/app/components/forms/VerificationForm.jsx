"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '@/app/styles/VerificationForm.css'
import { VerificationFormInteract } from "@/app/api/VerificationFormInteract";
import { useRouter } from "next/navigation";

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
        firstNumber: '',
        secondNumber: '',
        thirdNumber: '',
        fourthNumber: '',
        fifthNumber: '',
        sixthNumber: ''
    });

    const [sendAgain, setSendAgain] = useState(false);

    const handleSubmit = async (values) => {

        const code = `${values.firstNumber}${values.secondNumber}${values.thirdNumber}${values.fourthNumber}${values.fifthNumber}${values.sixthNumber}`;
        const email = localStorage.getItem('email');
        try {
            const response = await VerificationFormInteract(code, email);
            console.log("Código ingresado:", code);
            console.log("Respuesta del backend:", response);

            if (response && response.mail) {
                //router.push('../../pages/listaFiltrado');
                router.push('/pages/listaFiltrado').then(() => {
                    setTimeout(() => {
                        window.location.replace('/pages/listaFiltrado');
                    }, 300); // Le damos un poco más de tiempo para que termine la navegación
                });
                                
            }
        } catch (err) {
            console.error("Error en la verificación:", error.message);
        }

    }

    return (
        <div className="p-4 bg-white text-black min-h-screen flex items-center justify-center">
            <div className="p-6 bg-blue-200 rounded-xl shadow-lg w-full max-w-md">
                <Formik
                    initialValues={verificationResult}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="flex flex-col">
                            <h1 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                                Enter verification code
                            </h1>
                            <p className="text-center text-gray-700 mb-4">
                                We have just sent a verification code to your email.
                            </p>

                            <div className="flex justify-center gap-3 mb-4">
                                {["firstNumber", "secondNumber", "thirdNumber", "fourthNumber", "fifthNumber", "sixthNumber"].map((name, index) => (
                                    <Field
                                        key={index}
                                        maxLength="1"
                                        name={name}
                                        type="text"
                                        placeholder=""
                                        className="w-10 h-10 text-center text-lg border border-blue-400 rounded-lg bg-white"
                                    />
                                ))}
                            </div>

                            <ErrorMessage name="firstNumber" component="div" className="text-red-600 text-sm text-center" />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-lg mt-2 hover:bg-blue-700 transition"
                            >
                                Verify
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}