"use client"
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import React from "react";
import * as jwt from "jsonwebtoken";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const router = useRouter();

    React.useEffect(() => {
        const isAuthenticated = checkAuthentication(); // Verificar la autenticación del usuario

        if (!isAuthenticated) {
            router.push('auth/login');
        }
    }, []);

    const checkAuthentication = (): boolean => {
        // Obtener el token de autenticación del Local Storage
        const token = localStorage.getItem('token');

        if (token) {
            // Verificar si el token está expirado
            const decodedToken = jwt.decode(token);
            const isTokenExpired = decodedToken !== null && typeof decodedToken === 'object' && decodedToken.exp !== undefined && decodedToken.exp < Date.now() / 1000;
            if (!isTokenExpired) {
                return true; // El usuario está autenticado
            }
        }

        return false; // El usuario no está autenticado
    };

    if (checkAuthentication()) {
        return <>{children}</>;
    } else {
        return null;
    }
};

export default PrivateRoute;