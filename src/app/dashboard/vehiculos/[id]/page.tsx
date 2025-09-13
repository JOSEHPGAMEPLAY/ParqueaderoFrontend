'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ExitVehicleModal } from '@/components/vehicles/ExitVehicleModal';
import { CreateVehicleModal } from '@/components/vehicles/CreateVehicleModal';
import { VehiclesTable } from '@/components/vehicles/VehiclesTable';
import { VehiclesHeader } from '@/components/vehicles/VehiclesHeader';
import { useVehicles } from '@/hooks/useVehicles';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function Vehiculos() {
    const { user } = useAuth();
    const {
        isLoading,
        error,
        filterValue,
        price,
        modals,
        plateVehicle,
        filteredVehiculos,
        handlers
    } = useVehicles();

    return (
        <div className='flex flex-col min-h-screen items-center m-2'>
            <VehiclesHeader
                onFinalize={handlers.handleCalculateTotal}
            />
            
            <VehiclesTable
                vehiculos={filteredVehiculos}
                isLoading={isLoading}
                error={error}
                userRole={user?.role}
                filterValue={filterValue}
                onSearchChange={handlers.onSearchChange}
                onClear={handlers.onClear}
                onOpenCreateModal={handlers.openModalCreate}
                onExitVehicle={handlers.openExitVehicle}
                onDeleteVehicle={handlers.openModalDelete}
            />
            
            <CreateVehicleModal
                isOpen={modals.isOpenModalCreate}
                onClose={modals.onCloseModalCreate}
                plateVehicle={plateVehicle}
                onPlateChange={handlers.handleInputChange}
                onCreate={handlers.handleCreate}
            />
            
            <ConfirmModal
                isOpen={modals.isOpenModalDelete}
                onClose={modals.onCloseModalDelete}
                onConfirm={handlers.handleDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este vehiculo?"
                confirmText="Eliminar"
                confirmColor="danger"
            />
                        
            <ExitVehicleModal
                isOpen={modals.isOpenModalExitVehicle}
                onClose={modals.onCloseModalExitVehicle}
                price={price}
            />
        </div>
    );
}