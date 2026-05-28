'use client';

import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useComments';
import { AddOrEditCommentModal } from '@/components/vehicles/AddOrEditCommentModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { ArrowLeftIcon, PlusIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';

export default function Comentarios() {
    const { user } = useAuth();
    const {
        comments,
        isLoading,
        error,
        comment,
        isEdit,
        modals,
        handlers
    } = useComments();

    const canDeleteComment = (authorId: string) => {
        return user?.role === 'admin' || user?.role === 'owner' || user?.id === authorId;
    };

    const canEditComment = (authorId: string) => {
        return user?.id === authorId;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-default-200">
                <div className="flex justify-between items-center p-4 max-w-4xl mx-auto">
                    <Button
                        color="primary"
                        variant="light"
                        startContent={<ArrowLeftIcon className="size-5" />}
                        onPress={handlers.goBack}
                    >
                        Volver
                    </Button>
                    <Button
                        color="primary"
                        startContent={<PlusIcon className="size-5" />}
                        onPress={handlers.openModalAdd}
                    >
                        Agregar comentario
                    </Button>
                </div>
            </nav>

            <div className="flex flex-col gap-4 p-4 mt-16 max-w-4xl mx-auto w-full pb-20">
                {isLoading ? (
                    <div className="flex justify-center mt-10">
                        <Spinner label="Cargando comentarios..." />
                    </div>
                ) : error ? (
                    <p className="text-danger text-center text-xl">{error}</p>
                ) : comments.length === 0 ? (
                    <p className="text-default-500 text-center text-lg">No hay comentarios aún</p>
                ) : (
                    comments.map((c) => (
                        <Card key={c._id} className="w-full">
                            <CardBody className="gap-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <UserCircleIcon className="size-8 text-default-400" />
                                        <div>
                                            <p className="font-semibold">{c.author.username}</p>
                                            <p className="text-xs text-default-400">
                                                {new Date(c.createdAt).toLocaleString('es-CO')}
                                            </p>
                                        </div>
                                    </div>
                                    {canDeleteComment(c.author._id) && (
                                        <Dropdown className="bg-background border-1 border-default-200">
                                            <DropdownTrigger>
                                                <Button isIconOnly radius="full" size="sm" variant="light">
                                                    <EllipsisVerticalIcon className="size-5" />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Acciones del comentario">
                                                {canEditComment(c.author._id) ? (
                                                    <DropdownItem
                                                        key="edit"
                                                        className="text-primary"
                                                        color="primary"
                                                        startContent={<PencilIcon className="size-4" />}
                                                        onPress={() => handlers.openModalEdit(c)}
                                                    >
                                                        Editar
                                                    </DropdownItem>
                                                ) : null}
                                                <DropdownItem
                                                    key="delete"
                                                    className="text-danger"
                                                    color="danger"
                                                    startContent={<TrashIcon className="size-4" />}
                                                    onPress={() => handlers.openModalDelete(c)}
                                                >
                                                    Eliminar
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    )}
                                </div>
                                <p className="text-default-700">{c.message}</p>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>

            <AddOrEditCommentModal
                isOpen={modals.isOpenModalAddOrEditComment}
                onClose={modals.onCloseModalAddOrEditComment}
                comment={comment}
                onCommentChange={handlers.handleCommentChange}
                onCreate={handlers.handleSaveComment}
                isEdit={isEdit}
            />

            <ConfirmModal
                isOpen={modals.isOpenModalDelete}
                onClose={modals.onCloseModalDelete}
                onConfirm={handlers.handleDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este comentario?"
                confirmText="Eliminar"
                confirmColor="danger"
            />
        </div>
    );
}
