import { AddOrEditCommentProps } from "@/types/comment";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Button } from "@heroui/react";

export const AddOrEditCommentModal:  React.FC<AddOrEditCommentProps> = ({
    isOpen,
    onClose,
    comment,
    onCommentChange,
    onCreate,
    isEdit = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>{isEdit ? 'Editar comentario' : 'Ingresa tu comentario'}</ModalHeader>
                <ModalBody>
                    <Textarea
                        placeholder="Escribe tu comentario"
                        value={comment}
                        onChange={onCommentChange}
                        autoFocus
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onPress={onCreate}>
                        {isEdit ? 'Actualizar' : 'Agregar'}
                    </Button>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};