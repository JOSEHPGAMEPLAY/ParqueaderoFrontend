export interface Vehiculo {
    _id: string;
    plateNumber: string;
    entryTime: string;
    exitTime: string;
    price: string;
}

export interface VehicleState {
    vehiculos: Vehiculo[];
    isLoading: boolean;
    error: string | null;
    filterValue: string;
    selectedVehiculo: Vehiculo | null;
    price: string;
    plateVehicle: string;
}

export interface ExitOptions {
    hasTicket: boolean;
    isFree?: boolean;
}

export interface VehicleActions {
    onExitVehicle: (vehiculo: Vehiculo, options: ExitOptions) => void;
    onDeleteVehicle: (vehiculo: Vehiculo) => void;
    onCreateVehicle: () => void;
}

export type VehicleActionType =
    | 'exitWithTicket'
    | 'exitWithoutTicket'
    | 'free'
    | 'comment'
    | 'delete';

export interface UseVehicleActionsProps {
    onExitVehicle: (vehiculo: Vehiculo, options: ExitOptions) => void;
    onDeleteVehicle: (vehiculo: Vehiculo) => void;
    onAddComment: (vehiculo: Vehiculo) => void;
}

export interface ExitVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    price: string;
}

export interface CreateVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    plateVehicle: string;
    onPlateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCreate: () => void;
}

export interface VehicleTableRowProps {
    vehiculo: Vehiculo;
    columnKey: React.Key;
    userRole?: string;
    onAction: (action: VehicleActionType, vehiculo: Vehiculo) => void;
}

export interface VehiclesTableProps {
    vehiculos: Vehiculo[];
    isLoading: boolean;
    error: string | null;
    userRole?: string;
    filterValue: string;
    onSearchChange: (value?: string) => void;
    onClear: () => void;
    onOpenCreateModal: () => void;
    onExitVehicle: (vehiculo: Vehiculo, options: ExitOptions) => void;
    onDeleteVehicle: (vehiculo: Vehiculo) => void;
    onAddComment: (vehiculo: Vehiculo) => void;
}

export interface VehiclesHeaderProps {
    onFinalize: () => void;
}