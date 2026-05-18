import axios from "axios";
import { api } from "./api";
import { toast } from "react-toastify";

export async function addComment(_id: any, comment: string) {
    try {
        const res = await api.post("/parking/comment", { parkingRecordId: _id, message: comment });
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
}

export async function getComments(_id: any) {
    try {
        const res = await api.get(`/parking/comment/${_id}`);
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

export async function deleteComment(_id: any) {
    try {
        const res = await api.delete(`/parking/comment/${_id}`);
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

export async function updateComment(_id: any, comment: string) {
    try {
        const res = await api.put(`/parking/comment/${_id}`, { message: comment });
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
}