import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import { addComment, deleteComment, getComments, updateComment } from "@/services/parkingVehiclesComments";
import { Comment } from "@/types/comment";

export const useComments = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [comment, setComment] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { vehicleId } = useParams();
    const router = useRouter();

    const { isOpen: isOpenModalDelete, onOpen: onOpenModalDelete, onClose: onCloseModalDelete } = useDisclosure();
    const { isOpen: isOpenModalAddOrEditComment, onOpen: onOpenModalAddOrEditComment, onClose: onCloseModalAddOrEditComment } = useDisclosure();

    useEffect(() => {
        if (vehicleId) {
            const fetchData = async () => {
                try {
                    const comments = await getComments(vehicleId);
                    setComments(comments);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error al obtener los datos:', error);
                    setError(error instanceof Error ? error.message : 'Error al obtener los datos');
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    },[vehicleId]);

    const openModalAdd = useCallback(() => {
        setIsEdit(false);
        setComment('');
        onOpenModalAddOrEditComment();
    }, [onOpenModalAddOrEditComment]);

    const openModalEdit = useCallback((comment: Comment) => {
        setSelectedComment(comment);
        setComment(comment.message);
        setIsEdit(true);
        onOpenModalAddOrEditComment();
    }, [onOpenModalAddOrEditComment]);

    const openModalDelete = useCallback((comment: Comment) => {
        setSelectedComment(comment);
        onOpenModalDelete();
    }, [onOpenModalDelete]);

    const handleDelete = async () => {
        if (selectedComment) {
            try {
                await deleteComment(selectedComment._id);
                const updatedComments = await getComments(vehicleId);
                setComments(updatedComments);
                onCloseModalDelete();
            } catch (error) {
                console.error('Error al eliminar el comentario:', error);
                setError(error instanceof Error ? error.message : 'Error al eliminar el comentario');
                onCloseModalDelete();
            }
        }
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }

    const handleAddComment = async () => {
        if (comment.trim()) {
            try {
                await addComment(vehicleId, comment);
                const updatedComments = await getComments(vehicleId);
                setComments(updatedComments);
                setComment('');
                onCloseModalAddOrEditComment();
            } catch (error) {
                console.error('Error al agregar el comentario:', error);
                setError(error instanceof Error ? error.message : 'Error al agregar el comentario');
                onCloseModalAddOrEditComment();
            }
        }
    };

    const handleUpdateComment = async () => {
        if (selectedComment && comment.trim()) {
            try {
                await updateComment(selectedComment._id, comment);
                const updatedComments = await getComments(vehicleId);
                setComments(updatedComments);
                setComment('');
                setSelectedComment(null);
                onCloseModalAddOrEditComment();
            } catch (error) {
                console.error('Error al actualizar el comentario:', error);
                setError(error instanceof Error ? error.message : 'Error al actualizar el comentario');
                onCloseModalAddOrEditComment();
            }
        }
    };

    const handleSaveComment = async () => {
        if (isEdit) {
            await handleUpdateComment();
        } else {
            await handleAddComment();
        }
    };

    const goBack = () => {
        router.back();
    };

    return {
        comments,
        isLoading,
        error,
        comment,
        isEdit,
        modals: {
            isOpenModalDelete,
            onOpenModalDelete,
            onCloseModalDelete,
            isOpenModalAddOrEditComment,
            onOpenModalAddOrEditComment,
            onCloseModalAddOrEditComment,
        },
        handlers: {
            openModalAdd,
            openModalEdit,
            openModalDelete,
            handleDelete,
            handleCommentChange,
            handleSaveComment,
            goBack
        }
    };
};
