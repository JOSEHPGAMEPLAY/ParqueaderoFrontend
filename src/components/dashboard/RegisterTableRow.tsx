import { RegisterTableRowProps } from "@/types/dashboard";
import { Registro } from "@/types/registro";
import { formatDate } from "@/utils/format";
import { CurrencyDollarIcon, TrashIcon, TruckIcon } from "@heroicons/react/24/solid";
import { Button, Spinner, Tooltip } from "@heroui/react";

export const RegisterTableRow: React.FC<RegisterTableRowProps> = ({
    registro,
    columnKey,
    userRole,
    onNavigateToVehicles,
    onCalculateTotal,
    onDeleteRegister,
    isVehiclesNavigate
}) => {
    const cellValue = registro[columnKey as keyof Registro];

    const renderActions = () => {
        const canDelete = userRole === "admin" || userRole === "owner";

        return (
            <div className="flex flex-row">
                <Tooltip content="Ver Vehiculos" >
                    <Button onPress={() => onNavigateToVehicles(registro._id)} className="mr-5">
                        {isVehiclesNavigate ?
                            <Spinner label="Loading..." /> : 
                            <TruckIcon className='text-blue-500' />
                        }
                    </Button>
                </Tooltip>
                <Button onPress={() => onCalculateTotal(registro)} className="mr-5">
                    <CurrencyDollarIcon aria-label="Calcular total generado" className='text-green-600'/>
                </Button>
                {
                    canDelete && (
                        <Button onPress={() => onDeleteRegister(registro)}>
                            <TrashIcon aria-label="Eliminar registro" className='text-yellow-600' />
                        </Button>
                    )
                }
            </div>
        );
    };

    switch (columnKey) {
        case 'date':
            return <p>{formatDate(cellValue as string | number)}</p>;
        case 'parkedCars':
            return <p>{registro.parkedCars.length}</p>;
        case 'totalEarned':
            return <p>{cellValue}</p>;
        case 'actions':
            return renderActions();
        default:
            return cellValue;
    }
};