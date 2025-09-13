import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import ConfirmModal from "../common/ConfirmModal";
import { VehiclesTableProps, Vehiculo } from "@/types/vehicle";
import { useDisclosure } from "@heroui/modal";
import { useVehicleActions } from "@/hooks/useVehicleActions";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { TABLE_COLUMNS } from "@/constants/vehicleColumns";
import { Spinner } from "@heroui/spinner";
import { VehicleTableRow } from "./VehicleTableRow";

export const VehiclesTable: React.FC<VehiclesTableProps> = ({
    vehiculos,
    isLoading,
    error,
    userRole,
    filterValue,
    onSearchChange,
    onClear,
    onOpenCreateModal,
    onExitVehicle,
    onDeleteVehicle
}) => {
    const { handleVehicleAction } = useVehicleActions({
        onExitVehicle,
        onDeleteVehicle,
    });

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar placa"
                        startContent={<MagnifyingGlassIcon className="size-6" />}
                        value={filterValue}
                        onClear={onClear}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button 
                            color="primary" 
                            startContent={<PlusIcon className="size-6" />} 
                            onPress={onOpenCreateModal}
                        >
                            Agregar Vehiculo
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, onClear, onOpenCreateModal]);

    return (
        <>
            <Table
                aria-label="Lista de vehiculos" 
                className='md:w-auto snap-x'
                classNames={{
                    base: "max-w-[97vw] md:w-auto max-h-[80vh]",
                }}
                topContent={topContent}
                topContentPlacement="outside"
            >
                <TableHeader columns={TABLE_COLUMNS}>
                    {(column) => (
                        <TableColumn key={column.uid} align="center">
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    isLoading={isLoading} 
                    loadingContent={<Spinner className="mt-10" label="Loading..." />}
                    items={vehiculos}
                >
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => (
                                <TableCell className="text-center">
                                    <VehicleTableRow
                                        vehiculo={item}
                                        columnKey={columnKey}
                                        userRole={userRole}
                                        onAction={handleVehicleAction}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {error && <p className='text-red-500 text-xl'>{error}</p>}
        </>
    );
};