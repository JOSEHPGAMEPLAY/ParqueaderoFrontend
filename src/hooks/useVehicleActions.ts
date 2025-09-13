import { UseVehicleActionsProps, VehicleActionType, Vehiculo } from "@/types/vehicle";
import { useCallback } from "react";
import { toast } from "react-toastify";

export const useVehicleActions = ({
    onExitVehicle,
    onDeleteVehicle
}: UseVehicleActionsProps) => {

    const handleVehicleAction = useCallback((action: VehicleActionType, vehiculo: Vehiculo) => {
        switch (action) {
            case 'exit':
                onExitVehicle(vehiculo, false);
                break;
            case 'ticket':
                onExitVehicle(vehiculo, true);
                break;
            case 'comment':
                toast.info('Funcionalidad en desarrollo');
                break;
            case 'delete':
                onDeleteVehicle(vehiculo);
                break;
            default:
                console.warn('Acción no reconocida', action);
            
        }

    }, [onDeleteVehicle, onExitVehicle]);

    return { handleVehicleAction };
};