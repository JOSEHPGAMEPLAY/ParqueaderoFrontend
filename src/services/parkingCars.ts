import axios from "axios";
import { api } from "./api";
import { toast } from "react-toastify";

export async function calculateTotal(_id: any) {
    try {
        const res = await api.put(`/dailyParkingRecord/calculateTotalEarned/${_id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};


export async function getCarros(_id: any) {
    try {
        const res = await api.get(`/dailyParkingRecord/${_id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};

export async function deleteCar(_id: any) {
    try {
        const res = await api.delete(`/parking/${_id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};

export async function exitCar(plateNumber: any, isFree:boolean) {
    try {
        const res = await api.put("/parking/calculatePrice", { plateNumber: plateNumber, isFree: isFree });
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};

export async function addCar(plateNumber: any) {
    try {
        const res = await api.post("/parking", { plateNumber: plateNumber });
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};
