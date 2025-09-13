import { CreateVehicleModalProps } from "@/types/vehicle";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";

export const CreateVehicleModal:  React.FC<CreateVehicleModalProps> = ({
    isOpen,
    onClose,
    plateVehicle,
    onPlateChange,
    onCreate
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Ingresa la placa del vehiculo</ModalHeader>
                <ModalBody>
                    <Input
                        placeholder="Escribe la placa"
                        value={plateVehicle}
                        onChange={onPlateChange}
                        autoFocus
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onPress={onCreate}>
                        Agregar
                    </Button>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};