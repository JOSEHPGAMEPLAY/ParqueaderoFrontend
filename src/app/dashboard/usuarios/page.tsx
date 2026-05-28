'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { Spinner } from '@heroui/spinner';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { EllipsisVerticalIcon, KeyIcon } from '@heroicons/react/24/solid';
import { UserProfile } from '@/types/user';

const STATUS_COLUMNS = [
    { uid: 'username', name: 'Usuario' },
    { uid: 'role', name: 'Rol' },
    { uid: 'status', name: 'Estado' },
    { uid: 'actions', name: 'Acciones' },
];

export default function Usuarios() {
    const { user } = useAuth();
    const {
        users,
        isLoading,
        error,
        selectedUser,
        newPassword,
        confirmPassword,
        modals,
        handlers,
    } = useUsers();

    const canActivate = (targetUser: UserProfile) => {
        if (user?.role === 'owner') return true;
        if (user?.role === 'admin' && targetUser.role === 'user') return true;
        return false;
    };

    const canResetPassword = (targetUser: UserProfile) => {
        if (user?.role === 'owner' && targetUser.role !== 'owner') return true;
        if (user?.role === 'admin' && targetUser.role === 'user') return true;
        return false;
    };

    const renderCell = (userProfile: UserProfile, columnKey: React.Key) => {
        switch (columnKey) {
            case 'username':
                return <p className="font-medium">{userProfile.username}</p>;
            case 'role':
                return <p className="capitalize">{userProfile.role}</p>;
            case 'status':
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userProfile.isActive
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger'
                    }`}>
                        {userProfile.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                );
            case 'actions':
                return (
                    <Dropdown className="bg-background border-1 border-default-200">
                        <DropdownTrigger>
                            <Button isIconOnly radius="full" size="sm" variant="light">
                                <EllipsisVerticalIcon className="size-5" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Acciones de usuario">
                            {canResetPassword(userProfile) ? (
                                <DropdownItem
                                    key="password"
                                    startContent={<KeyIcon className="size-4" />}
                                    onPress={() => handlers.openPasswordModal(userProfile)}
                                >
                                    Cambiar contraseña
                                </DropdownItem>
                            ) : null}
                            {canActivate(userProfile) ? (
                                <DropdownItem
                                    key="activate"
                                    className={userProfile.isActive ? 'text-warning' : 'text-success'}
                                    color={userProfile.isActive ? 'warning' : 'success'}
                                    onPress={() => handlers.handleToggleActivation(userProfile)}
                                >
                                    {userProfile.isActive ? 'Desactivar' : 'Activar'}
                                </DropdownItem>
                            ) : null}
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col p-4 pt-20 lg:pt-10 gap-4">
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>

            {error && <p className="text-danger text-center text-xl">{error}</p>}

            <Table
                aria-label="Lista de usuarios"
                className="max-w-[97vw]"
            >
                <TableHeader columns={STATUS_COLUMNS}>
                    {(column) => (
                        <TableColumn key={column.uid} align="center">
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    isLoading={isLoading}
                    loadingContent={<Spinner className="mt-10" label="Cargando usuarios..." />}
                    items={users}
                >
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => (
                                <TableCell className="text-center">
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal isOpen={modals.isOpenPassword} onClose={modals.onClosePassword}>
                <ModalContent>
                    <ModalHeader>
                        Cambiar contraseña de {selectedUser?.username}
                    </ModalHeader>
                    <ModalBody className="flex flex-col gap-3">
                        <Input
                            label="Nueva contraseña"
                            placeholder="Ingresa la nueva contraseña"
                            type="password"
                            variant="bordered"
                            value={newPassword}
                            onValueChange={handlers.setNewPassword}
                        />
                        <Input
                            label="Confirmar contraseña"
                            placeholder="Confirma la nueva contraseña"
                            type="password"
                            variant="bordered"
                            value={confirmPassword}
                            onValueChange={handlers.setConfirmPassword}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onPress={handlers.handleResetPassword}>
                            Actualizar
                        </Button>
                        <Button color="danger" variant="light" onPress={modals.onClosePassword}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
