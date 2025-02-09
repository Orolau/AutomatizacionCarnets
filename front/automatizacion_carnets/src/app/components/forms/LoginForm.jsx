"use client"

import { useState } from "react";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import '@/app/styles/LoginForm.css'
import {useRouter} from "next/navigation";
import { LoginFormInteract } from "@/app/api/LoginFormInteract";

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Este campo es obligatorio').email('EL formato es incorrecto'),
    password: Yup.string().required('Este campo es obligatorio')
});

export default function LoginForm(){
    const router = useRouter();

    const[userInfo, setUserInfo] = useState({
        email:'',
        password:''
    });

    const handleSubmit = async(values) =>{

        const respuestaServer = await LoginFormInteract(values);
        console.log(respuestaServer);
        console.log(values);
        
        if(respuestaServer.token !== null){
            localStorage.setItem('tokenLogin', respuestaServer.token);
            router.push('/pages/userForms/verify');
        }
    }

    return (
        <div className="contenedorLogin bg-white flex-wrap justify-items-center p-20 shadow-md border rounded-lg">
            <Formik initialValues={userInfo} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {()=>(
                    <Form className="flex-wrap">
                        <h1 className="titulo font-bold mb-5">Login to your account</h1>
                        <div>
                            <Field name="email" type="email" placeholder="email" className="inputLogin border rounded-md"/>
                            <ErrorMessage name="email" component="div" className="error"/>
                        </div>
                        <div>
                            <div className="passwordContainer">
                                <Field name="password" type="password" placeholder="password" className="inputLogin border rounded-md" id="passWordField"></Field>
                                <button className="viewPassword">
                                    <img
                                        src="https://img.icons8.com/material-outlined/24/000000/invisible.png"
                                        className="size-5"
                                    />
                                </button>
                            </div>
                            <ErrorMessage name="password" component="div" className="error"/>
                        </div>
                        <button type="submit" className="bg-blue-300 w-[300px] border border-cyan-500 rounded-lg mb-5 hover:bg-blue-400">Sing in with email</button>
                    </Form>
                )}
            </Formik>
        </div>);
}