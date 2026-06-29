'use client';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, Button, Card, CardBody } from '@heroui/react';
import { UserCircleIcon, PencilIcon, KeyIcon } from '@heroicons/react/24/solid';

export default function Perfil() {
    const { user } = useAuth();
    const {
        username,
        oldPassword,
        newPassword,
        confirmPassword,
        modals,
        handlers,
    } = useProfile();

    return (
        <div className="flex flex-col items-center p-4 pt-20 lg:pt-10 gap-6">
            <h1 className="text-2xl font-bold">Mi Perfil</h1>

            <Card className="w-full max-w-md">
                <CardBody className="flex flex-col items-center gap-4 p-6">
                    <UserCircleIcon className="size-20 text-primary" />
                    <div className="text-center">
                        <p className="text-xl font-semibold">{user?.username}</p>
                        <p className="text-default-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <Button
                            color="primary"
                            variant="flat"
                            startContent={<PencilIcon className="size-4" />}
                            onPress={modals.onOpenEdit}
                        >
                            Editar perfil
                        </Button>
                        <Button
                            color="primary"
                            variant="light"
                            startContent={<KeyIcon className="size-4" />}
                            onPress={modals.onOpenPassword}
                        >
                            Cambiar contraseña
                        </Button>
                    </div>
                </CardBody>
            </Card>

            <Modal isOpen={modals.isOpenEdit} onClose={modals.onCloseEdit}>
                <ModalContent>
                    <ModalHeader>Editar perfil</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nombre de usuario"
                            placeholder="Ingresa tu nombre de usuario"
                            variant="bordered"
                            value={username}
                            onChange={handlers.handleUsernameChange}
                            autoFocus
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onPress={handlers.handleSaveProfile}>
                            Guardar
                        </Button>
                        <Button color="danger" variant="light" onPress={modals.onCloseEdit}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={modals.isOpenPassword} onClose={modals.onClosePassword}>
                <ModalContent>
                    <ModalHeader>Cambiar contraseña</ModalHeader>
                    <ModalBody className="flex flex-col gap-3">
                        <Input
                            label="Contraseña actual"
                            placeholder="Ingresa tu contraseña actual"
                            type="password"
                            variant="bordered"
                            value={oldPassword}
                            onValueChange={handlers.setOldPassword}
                        />
                        <Input
                            label="Nueva contraseña"
                            placeholder="Ingresa la nueva contraseña"
                            type="password"
                            variant="bordered"
                            value={newPassword}
                            onValueChange={handlers.setNewPassword}
                        />
                        <Input
                            label="Confirmar nueva contraseña"
                            placeholder="Confirma la nueva contraseña"
                            type="password"
                            variant="bordered"
                            value={confirmPassword}
                            onValueChange={handlers.setConfirmPassword}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onPress={handlers.handleChangePassword}>
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
