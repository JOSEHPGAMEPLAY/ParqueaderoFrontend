import axios from "axios";
import { api } from "./api";

export async function createRegisters() {
    try {
        const res = await api.post(`/dailyParkingRecord`);
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};

export async function deleteRegisters(_id: any) {
    try {
        const res = await api.delete(`/dailyParkingRecord/${_id}`);

        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};

export async function calculateTotal(_id: any) {
    try {
        const res = await api.put(`/dailyParkingRecord/calculateTotalEarned/${_id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};

export async function getRegisters() {
    try {
        const res = await api.get("/dailyParkingRecord");

        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};