import { LoginInputs, RegisterInputs } from "@/types/auth";
import { api } from "./api";
import axios from "axios";

export async function loginFetch(credentials: LoginInputs) {
    const { username, password } = credentials;
    try {
        const res = await api.post(
            "/auth/login",
            { username, password },
            { withCredentials: true }
        );
        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error en la solicitud");
        }
        throw new Error("Error de red o del servidor");
    }
}

export async function getMe() {
    try {
        const res = await api.get("/auth/me");
        return res.data;
    } catch (error: any) {
        console.error("Error fetching user data:", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al obtener los datos del usuario");
        }
        throw new Error("Error de red o del servidor");
    }
}

export async function logoutFetch() {
    try {
        await api.post(
            "/auth/logout",
            {},
            { withCredentials: true }
        );
    } catch (error: any) {
        console.error("Error al cerrar sesión:", error);
    }
}


export async function registerFetch(credentials: RegisterInputs) {
    const { username, password } = credentials;

    try {
        const res = await api.post("/auth/register", {
            username,
            password,
        });

        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
}