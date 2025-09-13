'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RegistersTable } from '@/components/dashboard/RegistersTable';


export default function Dashboard() {
    const { user } = useAuth();
    const {
        registros,
        isLoading,
        error,
        handleCreateRegister,
        handleNavigateToVehicles,
        handleCalculateTotal,
        handleDeleteRegister,
        isVehiclesNavigate
    } = useDashboard();

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col items-center m-2">
                <DashboardHeader
                    onCreateRegister={handleCreateRegister}
                    isLoading={isVehiclesNavigate}
                />
                <RegistersTable
                    registros={registros}
                    isLoading={isLoading}
                    error={error}
                    userRole={user?.role}
                    onNavigateToVehicles={handleNavigateToVehicles}
                    onCalculateTotal={handleCalculateTotal}
                    onDeleteRegister={handleDeleteRegister}
                    isVehiclesNavigate={isVehiclesNavigate}
                />
            </div>
        </ProtectedRoute>
    );
};