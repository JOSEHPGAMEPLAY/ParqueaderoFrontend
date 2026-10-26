import axios from "axios";
import { toast } from "react-toastify";
import { api } from "./api";
import { DashboardMetrics } from "@/types/analytics";

export async function getDashboardMetrics(days: number): Promise<DashboardMetrics> {
    try {
        const res = await api.get('/dashboard/metrics', { params: { days } });
        return res.data;
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}
