import axios from "axios";
import { api } from "./api";
import { toast } from "react-toastify";

export async function getUsers() {
    try {
        const res = await api.get("/user");
        return res.data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
        const res = await api.put(`/user/change-password/${userId}`, { oldPassword, newPassword });
        return res.data;
    } catch (error) {
        console.error('Error changing password:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}

export async function resetPassword(userId: string, newPassword: string) {
    try {
        const res = await api.put(`/user/reset-password/${userId}`, { newPassword });
        return res.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}

export async function updateUser(userId: string, data: { username?: string; role?: string }) {
    try {
        const res = await api.put(`/user/update/${userId}`, data);
        return res.data;
    } catch (error) {
        console.error('Error updating user:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}

export async function deleteUser(userId: string) {
    try {
        const res = await api.delete(`/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}

export async function toggleUserActivation(userId: string, isActive: boolean) {
    try {
        const res = await api.put(`/user/activate/${userId}`, { isActive });
        return res.data;
    } catch (error) {
        console.error('Error toggling user activation:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
}
