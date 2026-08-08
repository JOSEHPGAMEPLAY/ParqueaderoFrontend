import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { changePassword, updateUser } from "@/services/parkingUsers";
import { useDisclosure } from "@heroui/modal";
import { toast } from "react-toastify";

export const useProfile = () => {
    const { user, refreshUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
    const { isOpen: isOpenPassword, onOpen: onOpenPassword, onClose: onClosePassword } = useDisclosure();

    const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }, []);

    const handleSaveProfile = async () => {
        if (!user?.id) return;
        if (!username.trim()) {
            toast.error('El nombre de usuario no puede estar vacío');
            return;
        }
        try {
            await updateUser(user.id, { username: username.trim() });
            await refreshUser();
            toast.success('Perfil actualizado exitosamente');
            onCloseEdit();
        } catch {
            // error handled in service
        }
    };

    const handleChangePassword = async () => {
        if (!user?.id) return;
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Todos los campos son obligatorios');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        try {
            await changePassword(user.id, oldPassword, newPassword);
            toast.success('Contraseña actualizada exitosamente');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClosePassword();
        } catch {
            // error handled in service
        }
    };

    return {
        user,
        username,
        oldPassword,
        newPassword,
        confirmPassword,
        modals: {
            isOpenEdit,
            onOpenEdit,
            onCloseEdit,
            isOpenPassword,
            onOpenPassword,
            onClosePassword,
        },
        handlers: {
            setUsername,
            setOldPassword,
            setNewPassword,
            setConfirmPassword,
            handleUsernameChange,
            handleSaveProfile,
            handleChangePassword,
        }
    };
};
