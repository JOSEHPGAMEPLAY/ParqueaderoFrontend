import React from "react";
import { ExitVehicleModalProps } from "@/types/vehicle";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";

export const ExitVehicleModal: React.FC<ExitVehicleModalProps> = ({
    isOpen,
    onClose,
    price
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Valor a cobrar</ModalHeader>
                <ModalBody>
                    <p className="text-lg font-semibold text-center">{price}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="warning" onPress={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};