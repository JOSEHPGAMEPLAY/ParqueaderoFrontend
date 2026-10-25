import {
    UseVehicleActionsProps,
    VehicleActionType,
    Vehiculo,
} from "@/types/vehicle";
import { useCallback } from "react";

export const useVehicleActions = ({
    onExitVehicle,
    onDeleteVehicle,
    onAddComment
}: UseVehicleActionsProps) => {

    const handleVehicleAction = useCallback((action: VehicleActionType, vehiculo: Vehiculo) => {
        switch (action) {
            case 'exitWithTicket':
                onExitVehicle(vehiculo, { hasTicket: true });
                break;
            case 'exitWithoutTicket':
                onExitVehicle(vehiculo, { hasTicket: false });
                break;
            case 'free':
                onExitVehicle(vehiculo, { hasTicket: true, isFree: true });
                break;
            case 'comment':
                onAddComment(vehiculo);
                break;
            case 'delete':
                onDeleteVehicle(vehiculo);
                break;
            default:
                console.warn('Acción no reconocida', action);
        }

    }, [onDeleteVehicle, onExitVehicle, onAddComment]);

    return { handleVehicleAction };
}
