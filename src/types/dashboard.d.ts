export interface DashboardHeaderProps {
    onCreateRegister: () => void;
    isLoading: boolean;
}

export interface RegisterTableRowProps {
    registro: Registro;
    columnKey: React.Key;
    userRole?: string;
    onNavigateToVehicles: (id: string) => void;
    onCalculateTotal: (registro: Registro) => void;
    onDeleteRegister: (registro: Registro) => void;
    isVehiclesNavigate: boolean;
}

export interface RegistersTableProps {
    registros: Registro[];
    isLoading: boolean;
    error: string | null;
    userRole?: string;
    onNavigateToVehicles: (id: string) => void;
    onCalculateTotal: (registro: Registro) => void;
    onDeleteRegister: (registro: Registro) => void;
    isVehiclesNavigate: boolean;
}