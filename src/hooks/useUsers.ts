import { useCallback, useEffect, useMemo, useState } from "react";
import { UserProfile } from "@/types/user";
import { useDisclosure } from "@heroui/modal";
import { getUsers, resetPassword, toggleUserActivation, deleteUser } from "@/services/parkingUsers";
import { toast } from "react-toastify";

export const useUsers = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { isOpen: isOpenPassword, onOpen: onOpenPassword, onClose: onClosePassword } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        return users.filter(u =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al obtener usuarios');
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const openPasswordModal = useCallback((user: UserProfile) => {
        setSelectedUser(user);
        setNewPassword('');
        setConfirmPassword('');
        onOpenPassword();
    }, [onOpenPassword]);

    const openDeleteModal = useCallback((user: UserProfile) => {
        setSelectedUser(user);
        onOpenDelete();
    }, [onOpenDelete]);

    const handleToggleActivation = async (user: UserProfile) => {
        try {
            await toggleUserActivation(user._id, !user.isActive);
            setUsers(prev => prev.map(u =>
                u._id === user._id ? { ...u, isActive: !u.isActive } : u
            ));
            toast.success(`Usuario ${!user.isActive ? 'activado' : 'desactivado'} correctamente`);
        } catch {
            // error handled in service
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser._id);
            setUsers(prev => prev.filter(u => u._id !== selectedUser._id));
            toast.success('Usuario eliminado exitosamente');
            onCloseDelete();
            setSelectedUser(null);
        } catch {
            // error handled in service
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser) return;
        if (!newPassword || !confirmPassword) {
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
            await resetPassword(selectedUser._id, newPassword);
            toast.success('Contraseña actualizada exitosamente');
            setNewPassword('');
            setConfirmPassword('');
            onClosePassword();
        } catch {
            // error handled in service
        }
    };

    return {
        users: filteredUsers,
        allUsers: users,
        isLoading,
        error,
        selectedUser,
        searchTerm,
        newPassword,
        confirmPassword,
        modals: {
            isOpenPassword,
            onClosePassword,
            isOpenDelete,
            onCloseDelete,
        },
        handlers: {
            setSearchTerm,
            setNewPassword,
            setConfirmPassword,
            openPasswordModal,
            openDeleteModal,
            handleToggleActivation,
            handleDeleteUser,
            handleResetPassword,
        }
    };
};
