import { RegisterTableRowProps } from "@/types/dashboard";
import { Registro } from "@/types/registro";
import { formatDate } from "@/utils/format";
import { CurrencyDollarIcon, EllipsisVerticalIcon, TrashIcon, TruckIcon } from "@heroicons/react/24/solid";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, Tooltip } from "@heroui/react";

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
                <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="bg-background border-1 border-default-200">
                        <DropdownTrigger>
                            <Button isIconOnly radius="full" size="sm" variant="light">
                                <EllipsisVerticalIcon />
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu
                            aria-label="Acciones del registro"
                            onAction={(key) => {
                                switch (key) {
                                    case "vehicles":
                                        onNavigateToVehicles(registro._id);
                                        break;
                                    case "total":
                                        onCalculateTotal(registro);
                                        break;
                                    case "delete":
                                        onDeleteRegister(registro);
                                        break;
                                    default:
                                        console.warn("Acción no reconocida", key);
                                }
                            }}
                        >
                            <DropdownItem
                                key="vehicles"
                                className="text-primary"
                                color="primary"
                                startContent={
                                    isVehiclesNavigate ? (
                                        <Spinner size="sm" label="Loading..." />
                                    ) : (
                                        <TruckIcon
                                            aria-label="Ver vehículos"
                                            className="w-4 h-4"
                                        />
                                    )
                                }
                            >
                                Ver Vehículos
                            </DropdownItem>

                            <DropdownItem
                                key="total"
                                className="text-success"
                                color="success"
                                startContent={
                                    <CurrencyDollarIcon
                                        aria-label="Calcular total generado"
                                        className="w-4 h-4"
                                    />
                                }
                            >
                                Calcular Total
                            </DropdownItem>

                            {canDelete? (
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={
                                        <TrashIcon
                                            aria-label="Eliminar registro"
                                            className="w-4 h-4"
                                        />
                                    }
                                >
                                    Eliminar
                                </DropdownItem>
                            ) : null}
                        </DropdownMenu>
                    </Dropdown>
                </div>
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