import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Vehiculo } from "@/types/vehicle";
import { useDisclosure } from "@heroui/modal";
import { addVehicle, deleteVehicle, exitVehicle, getVehicles } from "@/services/parkingVehicles";
import { calculateTotal } from "@/services/parkingRegisters";

export const useVehicles = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [plateVehicle, setPlateVehicle] = useState('');
    const [price, setPrice] = useState('');
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
    const [filterValue, setFilterValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { id } = useParams();
    const router = useRouter();

    // Modales
    const { isOpen: isOpenModalDelete, onOpen: onOpenModalDelete, onClose: onCloseModalDelete } = useDisclosure();
    const { isOpen: isOpenModalCreate, onOpen: onOpenModalCreate, onClose: onCloseModalCreate } = useDisclosure();
    const { isOpen: isOpenModalExitVehicle, onOpen: onOpenModalExitVehicle, onClose: onCloseModalExitVehicle } = useDisclosure();

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const vehiculos = await getVehicles(id);
                    setVehiculos(vehiculos);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error al obtener los datos:', error);
                    setError(error instanceof Error ? error.message : 'Error al obtener los datos');
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    },[id]);

    // Filtrado de vehículos
    const filteredVehiculos = useMemo(() => {
        return vehiculos.filter((vehiculo) => {
            return vehiculo.plateNumber.toLowerCase().includes(filterValue.toLowerCase());
        });
    }, [vehiculos, filterValue]);

    // Handlers
    const openExitVehicle = useCallback(async (vehiculo: Vehiculo, isFree: boolean) => {
        try {
            setSelectedVehiculo(vehiculo);
            const salida = await exitVehicle(vehiculo.plateNumber, isFree);
            const updatedVehicles = await getVehicles(id);
            setVehiculos(updatedVehicles);
            setPrice(salida.price);
            onOpenModalExitVehicle();
        } catch (error) {
            console.error('Error al procesar la salida del vehículo:', error);
            setError(error instanceof Error ? error.message : 'Error al procesar la salida del vehículo');
        }
    }, [id, onOpenModalExitVehicle]);

    const openModalDelete = useCallback((vehiculo: Vehiculo) => {
        setSelectedVehiculo(vehiculo);
        onOpenModalDelete();
    }, [onOpenModalDelete]);

    const openModalCreate = useCallback(() => {
        onOpenModalCreate();
    }, [onOpenModalCreate]);

    const onSearchChange = useCallback((value?: string) => {
        setFilterValue(value || "");
    },[]);

    const onClear = useCallback(() => {
        setFilterValue("");
    }, []);

    const handleDelete = async () => {
        if (selectedVehiculo) {
            try {
                await deleteVehicle(selectedVehiculo._id);
                setVehiculos(prev => prev.filter(v => v._id !== selectedVehiculo._id));
                onCloseModalDelete();
            } catch (error) {
                console.error('Error al eliminar el vehículo:', error);
                setError(error instanceof Error ? error.message : 'Error al eliminar el vehículo');
                onCloseModalDelete();
            }
        }
    };

    const handleCreate = async () => {
        if (plateVehicle.trim()) {
            try {
                await addVehicle(plateVehicle);
                const updatedVehicles = await getVehicles(id);
                setVehiculos(updatedVehicles);
                setPlateVehicle('');
                onCloseModalCreate();
            } catch (error) {
                console.error('Error al agregar el vehículo:', error);
                setError(error instanceof Error ? error.message : 'Error al agregar el vehículo');
                onCloseModalCreate();
            }
        }else{
            setError('La placa no puede estar vacía');
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlateVehicle(event.target.value.toUpperCase());
    };

    const handleCalculateTotal = async () => {
        try {
            await calculateTotal(id);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error al calcular el total:', error);
            setError(error instanceof Error ? error.message : 'Error al calcular el total');
        }
    };

    return {
        vehiculos,
        isLoading,
        error,
        filterValue,
        selectedVehiculo,
        price,
        plateVehicle,
        filteredVehiculos,
        modals: {
            isOpenModalDelete,
            onOpenModalDelete,
            onCloseModalDelete,
            isOpenModalCreate,
            onOpenModalCreate,
            onCloseModalCreate,
            isOpenModalExitVehicle,
            onOpenModalExitVehicle,
            onCloseModalExitVehicle
        },
        handlers: {
            openExitVehicle,
            openModalDelete,
            openModalCreate,
            onSearchChange,
            onClear,
            handleDelete,
            handleCreate,
            handleInputChange,
            handleCalculateTotal
        }
    };
};