"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarTop from "./components/ui/NavbarTop"; // Nuevo NavbarTop
import { useState } from "react";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Obtiene la ruta actual

  const hideNavbarRoutes = ["/pages/userForms/login", "/pages/verify"]; // Rutas donde no se muestra el NavbarTop

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Muestra el NavbarTop solo si no estás en las rutas de login o verify */}
        {!hideNavbarRoutes.includes(pathname) && <NavbarTop />}
        {children}
      </body>
    </html>
  );
}
