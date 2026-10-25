import React from "react";
import { ExitVehicleModalProps } from "@/types/vehicle";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from "@heroui/react";
import { formatCurrency } from "@/utils/pricing";

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
                    <p className="text-2xl font-bold text-success text-center">
                        {formatCurrency(Number(price))}
                    </p>
                    <p className="text-xs text-default-500 text-center">
                        Calculado con la tarifa central configurada.
                    </p>
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
