'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import * as jwt from "jsonwebtoken"

export default function Home()  {
    const router = useRouter();
    const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = jwt.decode("token");
            const isTokenExpired = decodedToken !== null && typeof decodedToken === 'object' && decodedToken.exp !== undefined && decodedToken.exp < Date.now() / 1000;
            if (isTokenExpired) {
                // Si el token ha expirado, redirigir al inicio de sesión
                router.push('/auth/login');
            }
            router.push('/dashboard');
        } else {
            router.push('/auth/login');
        }
    return <div className="flex h-screen justify-center items-center"><Spinner /></div>;
}