import React from "react";
import { VehicleActionType, VehicleTableRowProps, Vehiculo } from "@/types/vehicle";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { ChatBubbleLeftIcon, CurrencyDollarIcon, EllipsisVerticalIcon, TicketIcon, TrashIcon } from '@heroicons/react/24/solid';
import { formatTime } from "@/utils/format";

export const VehicleTableRow: React.FC<VehicleTableRowProps> = ({
    vehiculo,
    columnKey,
    userRole,
    onAction
}) => {
    const cellValue = vehiculo[columnKey as keyof Vehiculo];
    
    const renderActions = () => {
        const canDelete = userRole === "admin" || userRole === "owner";
        
        return (
            <div className="flex flex-row">
                <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="bg-background border-1 border-default-200">
                        <DropdownTrigger>
                            <Button isIconOnly radius="full" size="sm" variant="light">
                                <EllipsisVerticalIcon/>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label='Acciones del vehiculo'
                            onAction={(key) => onAction(key as VehicleActionType, vehiculo)}
                        >
                            <DropdownItem
                                key="exit"
                                className="text-success"
                                color="success"
                                startContent={
                                    <CurrencyDollarIcon 
                                        aria-label="Salida sin ticket calcular precio" 
                                        className="w-4 h-4" 
                                    />
                                }
                            >
                                Cobrar
                            </DropdownItem>
                            <DropdownItem
                                key="ticket"
                                className="text-primary"
                                color="primary"
                                startContent={
                                    <TicketIcon 
                                        aria-label="Salida con ticket, salida gratis"  
                                        className="w-4 h-4" 
                                    />
                                }
                            >
                                Ticket
                            </DropdownItem>
                            <DropdownItem
                                key="comment"
                                className="text-primary"
                                color="primary"
                                startContent={
                                    <ChatBubbleLeftIcon  
                                        aria-label="Agregar comentario"  
                                        className="w-4 h-4" 
                                    />
                                }
                            >
                                Comentario
                            </DropdownItem>
                            {canDelete ? (
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={
                                        <TrashIcon 
                                            aria-label="Eliminar vehiculo" 
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
        case 'plateNumber':
            return <p>{cellValue}</p>;
        case 'entryTime':
            return <p>{formatTime(cellValue as string | number)}</p>;
        case 'exitTime':
            return <p>{formatTime(cellValue as string | number)}</p>;
        case 'price':
            return <p>{cellValue}</p>;
        case 'actions':
            return renderActions();
        default:
            return cellValue;
    }
};