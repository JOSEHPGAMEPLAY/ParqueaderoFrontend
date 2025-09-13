import { VehiclesHeaderProps } from "@/types/vehicle";
import { Button } from "@heroui/button";
import { useParams } from "next/navigation";

export const VehiclesHeader: React.FC<VehiclesHeaderProps> = ({
    onFinalize
}) => {
    const { id } = useParams();

    return (
        <>
            <h1 className="my-2">Vehiculos para el registro {id}</h1>
            <div className="flex my-2 mb-4">
                <Button color="success" onPress={onFinalize}>
                    Finalizar
                </Button>
            </div>
        </>
    );
};