"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Button } from "@heroui/button";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "secondary" | "success" | "warning" | "danger";
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de continuar con esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "danger",
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color={confirmColor} variant="solid" onPress={onConfirm}>
            {confirmText}
          </Button>
          <Button color="warning" variant="light" onPress={onClose}>
            {cancelText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
