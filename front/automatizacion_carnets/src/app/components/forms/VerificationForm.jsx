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

export default function VerificationForm(){

    const router = useRouter();

    const[verificationResult, setVerificationResult] = useState({
        firstNumber: '',
        secondNumber:'',
        thirdNumber: '',
        fourthNumber: '',
        fifthNumber: '',
        sixthNumber: ''
    });

    const [sendAgain,setSendAgain] = useState(false);

    const handleSubmit = async(values) =>{

        const code = `${values.firstNumber}${values.secondNumber}${values.thirdNumber}${values.fourthNumber}${values.fifthNumber}${values.sixthNumber}`;
        const response = await VerificationFormInteract(code, localStorage.getItem('token'));
        console.log(code);
        console.log(response);
        console.log(values);
        if(response.acknowledged){
            router.push('/pages/userForms/login');
        }
    }

    return (
    <div className="contenedorLogin bg-white flex-wrap justify-items-center p-20 shadow-md border rounded-lg">
        <Formik initialValues={verificationResult} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {()=>(
                <Form className="formContainer flex-wrap">
                    <h1 className="titulo font-bold mb-5">Enter verification code</h1>
                    <p className="verificactionSentText w-[300px] mb-5">We have just sent a verification code to</p>
                    
                    <div className="numbersContainer flex w-[300px] mb-5 gap-3">
                        <Field maxLength="1" name="firstNumber" type="string" placeholder="" className="numberBox border rounded-md"/>
                        <ErrorMessage name="firstNumber" component="div" className="error"/>

                        <Field maxLength="1" name="secondNumber" type="string" placeholder="" className="numberBox border rounded-md"/>
                        <ErrorMessage name="secondNumber" component="div" className="error"/>
                        
                        <Field maxLength="1" name="thirdNumber" type="string" placeholder="" className="numberBox border rounded-md"/>
                        <ErrorMessage name="thirdNumber" component="div" className="error"/>
                    
                        <Field maxLength="1" name="fourthNumber" type="string" placeholder="" className="numberBox border rounded-md"/>
                        <ErrorMessage name="fourthNumber" component="div" className="error"/>
                    
                        <Field maxLength="1" name="fifthNumber" type="string" placeholder="" className="numberBox border rounded-md"/>
                        <ErrorMessage name="fifthNumber" component="div" className="error"/>

                        <Field maxLength="1" name="sixthNumber" type="string" placeholder="" className="numberBox border rounded-md"/>
                        <ErrorMessage name="sixthNumber" component="div" className="error"/>
                    </div>
                    
                    <button type="submit" className="bg-blue-300 w-[300px] border border-cyan-500 rounded-lg mb-5 hover:bg-blue-400">
                        verify
                    </button>
                </Form>
            )}
        </Formik>
    </div>);
}