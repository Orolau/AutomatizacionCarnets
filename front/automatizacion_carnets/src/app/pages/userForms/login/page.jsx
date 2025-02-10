"use client"

import LoginForm from '@/app/components/forms/LoginForm';
import Navbar from '@/app/components/ui/Navbar'; // Importa el Navbar

export default function LoginPage() {
    return (
        <>
            <Navbar /> {/* Agrega el Navbar aquí */}
            <LoginForm />
        </>
    );
}