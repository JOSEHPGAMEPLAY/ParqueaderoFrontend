import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateTotal, createRegisters, deleteRegisters, getRegisters } from "@/services/parkingRegisters";
import { Registro } from "@/types/registro";
import { sortRegistersByDate } from "@/utils/format";

export const useDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isVehiclesNavigate, setIsVehiclesNavigate] = useState(false);
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getRegisters();
                const sortedData = sortRegistersByDate(data);
                setRegistros(sortedData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error instanceof Error ? error.message : 'Ocurrió un error al obtener los registros');
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNavigateToVehicles = useCallback((id: string) => {
        setIsVehiclesNavigate(true);
        router.push(`/dashboard/vehiculos/${id}`);
    },[router]);

    const handleDeleteRegister = useCallback(async (registro: Registro) => {
        try {
            await deleteRegisters(registro._id);
            setRegistros(prev => prev.filter(r => r._id !== registro._id));
        } catch (error) {
            console.error('Error deleting register:', error);
            setError(error instanceof Error ? error.message : 'Ocurrió un error al eliminar el registro');
        }
    }, []);

    const handleCalculateTotal = useCallback(async (registro: Registro) => {
        try {
            await calculateTotal(registro._id);
            const updatedRegistros = await getRegisters();
            const sortedData = sortRegistersByDate(updatedRegistros);
            setRegistros(sortedData);
        } catch (error) {
            console.error('Error al calcular el total:', error);
            setError(error instanceof Error ? error.message : 'Ocurrió un error al calcular el total');
        }
    }, []);

    const handleCreateRegister = useCallback(async () => {
        try {
            const register = await createRegisters();
            handleNavigateToVehicles(register._id);
        } catch (error) {
            console.error('Error al crear el registro:', error);
            setError(error instanceof Error ? error.message : 'Ocurrió un error al crear el registro');
        }
    }, [handleNavigateToVehicles]);

    return {
        registros,
        isLoading,
        error,
        isVehiclesNavigate,
        handleNavigateToVehicles,
        handleDeleteRegister,
        handleCalculateTotal,
        handleCreateRegister
    };
};