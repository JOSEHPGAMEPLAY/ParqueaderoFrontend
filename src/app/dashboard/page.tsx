'use client';

import React from 'react';
import PrivateRoute from '../components/PrivateRoute';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import axios from 'axios';
import { TrashIcon, TruckIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

async function createRegisters() {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/dailyParkingRecord`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );
        console.log(res);
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};

async function deleteRegisters(_id: any) {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/dailyParkingRecord/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );

        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};

async function calculateTotal(_id: any) {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/dailyParkingRecord/calculateTotalEarned/${_id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        );
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};

async function getRegisters() {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dailyParkingRecord`, {

            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );

        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};

interface Registro {
    _id: string;
    date: string;
    parkedCars: string[];
    totalEarned: number;
    __v: number;
};

const columns = [
    { name: "Fecha", uid: "date" },
    { name: "CARROS PARQUEADOS", uid: "parkedCars" },
    { name: "TOTAL", uid: "totalEarned" },
    { name: "ACCIONES", uid: "actions" },
];

// Función auxiliar para agregar ceros a un número si es necesario
const agregarCeros = (numero: number): string => {
    return numero < 10 ? `0${numero}` : `${numero}`;
};

// Función para ordenar los registros por fecha más reciente a más antigua
const sortRegistersByDate = (registros: Registro[]) => {
    return registros.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  

export default function Dashboard() {

    const [isLoading, setIsLoading] = React.useState(true);
    const [isCarsNavigate, setIsCarsNavigate] = React.useState(false);
    const [registros, setRegistros] = React.useState<Registro[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedRegistro, setSelectedRegistro] = React.useState<Registro | null>(null);

    const router = useRouter();

    React.useEffect(() => {
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

    const openModal = async (registro: Registro) => {
        setSelectedRegistro(registro);
        onOpen();
    };

    const handleNavigate = (id: any) => {
        setIsCarsNavigate(true);
        router.push(`/dashboard/carros/${id}`);
    };

    const renderCell = React.useCallback((registro: Registro, columnKey: React.Key) => {
        const cellValue = registro[columnKey as keyof Registro];

        switch (columnKey) {
            case 'date':
                if (typeof cellValue === 'string' || typeof cellValue === 'number') {
                    const fecha = new Date(cellValue);
                    const fechaFormateada = `${fecha.getUTCFullYear()}-${agregarCeros(fecha.getUTCMonth() + 1)}-${agregarCeros(fecha.getUTCDate())}`;
                    return (
                        <p>{fechaFormateada}</p>
                    );
                }
            case 'parkedCars':
                return (
                    <p>{registro.parkedCars.length}</p>
                );
            case 'totalEarned':
                return (
                    <p>{cellValue}</p>
                );
            case 'actions':
                return (
                    <div className="flex flex-row">
                        <Tooltip content="Ver Carros" >
                            <Button onPress={() => handleNavigate(registro._id)} className="mr-5">
                                {isCarsNavigate ? <Spinner label="Loading..." /> : <TruckIcon className='text-blue-500' />}
                            </Button>
                        </Tooltip>
                        <Button onPress={() => handleCalculateTotal(registro)} className="mr-5">
                            <CurrencyDollarIcon aria-label="Calcular precio" className='text-green-600' />
                        </Button>
                        <Button onPress={() => openModal(registro)}>
                            <TrashIcon aria-label="Eliminar registro" className='text-yellow-600' />
                        </Button>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const handleDelete = async () => {
        if (selectedRegistro) {
            try {
                await deleteRegisters(selectedRegistro._id);
                setRegistros(registros.filter(reg => reg._id !== selectedRegistro._id));
                onClose();
            } catch (error) {
                console.error('Error deleting data:', error);
                setError('Ocurrió un error al eliminar el registro');
                onClose();
            }
        }
    };

    const handleCalculateTotal = async (registroCalculate: Registro) => {
        console.log("calculate", registroCalculate);
        try {
            await calculateTotal(registroCalculate._id);
            setRegistros(await getRegisters());
        } catch (error) {
            console.error('Error al calcular el total:', error);
        }
    };

    const handleCreateRegister = async () => {
        try {
            const register = await createRegisters();
            handleNavigate(register._id);
        } catch (error) {
            console.error('Error al crear el registro:', error);
        }
    };

    return (
        <PrivateRoute>
            <div className="flex min-h-screen flex-col items-center">
                <h1 className='my-10 font-medium text-3xl'>Registro de Parqueadero</h1>
                <div className="flexjustify-center mb-5">
                    <Button color="primary" onPress={handleCreateRegister}>{isCarsNavigate ? <Spinner color="default" /> : "Agregar Registro"}</Button>
                </div>
                <Table aria-label="Lista de registros"
                    classNames={{
                        base: "max-w-4/5 md:w-auto overflow-scroll",
                        table: "max-w-4/5 md:w-auto overflow-scroll "
                    }}>
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        isLoading={isLoading} items={registros} loadingContent={<Spinner className="mt-10" label="Loading..." />}>
                        {(item) => (
                            <TableRow key={item._id}>
                                {(columnKey) => <TableCell className="text-center" >{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {error && <p className='text-red-500 text-xl'>{error}</p>}
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalContent>
                        <ModalHeader>Confirmar Eliminación</ModalHeader>
                        <ModalBody>
                            <p>¿Estás seguro de que deseas eliminar este registro?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={handleDelete}>
                                Eliminar
                            </Button>
                            <Button color="warning" onPress={onClose}>
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </PrivateRoute>
    );
};