import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { Registro } from "@/types/registro";
import ConfirmModal from '@/components/common/ConfirmModal';
import { DASHBOARD_TABLE_COLUMNS } from "@/constants/dashboardColumns";
import { RegisterTableRow } from "./RegisterTableRow";
import { RegistersTableProps } from "@/types/dashboard";

export const RegistersTable: React.FC<RegistersTableProps> = ({
    registros,
    isLoading,
    error,
    userRole,
    onNavigateToVehicles,
    onCalculateTotal,
    onDeleteRegister,
    isVehiclesNavigate
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedRegistro, setSelectedRegistro] = useState<Registro | null>(null);

    const handleOpenDeleteModal = (registro: Registro) => {
        setSelectedRegistro(registro);
        onOpen();
    };

    const handleConfirmDelete = () => {
        if (selectedRegistro) {
            onDeleteRegister(selectedRegistro);
            setSelectedRegistro(null);
            onClose();
        }
    }

    return (
        <>
            <Table
                aria-label="Lista de registros"
                classNames={{
                    base: "max-w-4/5 md:w-auto",
                    table: "max-w-4/5 md:w-auto"
                }}
            >
                <TableHeader columns={DASHBOARD_TABLE_COLUMNS}>
                    {(column)=>(
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    isLoading={isLoading}
                    items={registros}
                    loadingContent={<Spinner className="mt-10" label="Cargando..." />}
                >
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => (
                                <TableCell className="text-center">
                                    <RegisterTableRow
                                        registro={item}
                                        columnKey={columnKey}
                                        userRole={userRole}
                                        onNavigateToVehicles={onNavigateToVehicles}
                                        onCalculateTotal={onCalculateTotal}
                                        onDeleteRegister={handleOpenDeleteModal}
                                        isVehiclesNavigate={isVehiclesNavigate}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            <ConfirmModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este registro?"
                confirmText="Eliminar"
                confirmColor="danger"
            />
        </>
    );
}