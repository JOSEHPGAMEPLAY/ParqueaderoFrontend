import axios from "axios";
import { toast } from "react-toastify";
import { api } from "./api";
import { AppConfig, AppConfigPatch } from "@/types/appConfig";

export async function getAppConfig(): Promise<AppConfig> {
    try {
        const res = await api.get('/config');
        return res.data.config;
    } catch (error) {
        console.error('Error fetching app config:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}

export async function updateAppConfig(patch: AppConfigPatch): Promise<AppConfig> {
    try {
        const res = await api.put('/config', patch);
        return res.data.config;
    } catch (error) {
        console.error('Error updating app config:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}
