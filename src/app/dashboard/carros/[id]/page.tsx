'use client';

import { CurrencyDollarIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon, TicketIcon } from '@heroicons/react/24/solid';
import { Input } from '@nextui-org/input';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner, Button, Dropdown, DropdownTrigger, SortDescriptor } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';

interface Carro {
    _id: string;
    plateNumber: string;
    entryTime: string;
    exitTime: string;
    price: string;
}

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
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};


async function getCarros(_id: any) {
    try {
        console.log("getCarros", _id);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dailyParkingRecord/${_id}`, {

            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );

        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};

async function deleteCar(_id: any) {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/parking/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};

async function exitCar(plateNumber: any, isFree:boolean) {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/parking/calculatePrice`, { plateNumber: plateNumber, isFree: isFree }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        );
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};

async function addCar(plateNumber: any) {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/parking`, { plateNumber: plateNumber }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        );
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || 'Error en la solicitud');
        } else {
            toast.error('Error de red o del servidor');
        }
        throw error;
    }
};

const agregarCeros = (numero: any) => {
    return numero < 10 ? `0${numero}` : `${numero}`;
};

const columns = [
    { name: "Numero de placa", uid: "plateNumber" },
    { name: "Hora de entrada", uid: "entryTime" },
    { name: "Hora de salida", uid: "exitTime" },
    { name: "Precio", uid: "price" },
    { name: "Acciones", uid: "actions" },
];

export default function Carros() {
    const { role } = useAuth();
    const [isLoading, setIsLoading] = React.useState(true);
    const { isOpen: isOpenModalDelete, onOpen: onOpenModalDelete, onClose: onCloseModalDelete } = useDisclosure();
    const { isOpen: isOpenModalCreate, onOpen: onOpenModalCreate, onClose: onCloseModalCreate } = useDisclosure();
    const { isOpen: isOpenModalExitCar, onOpen: onOpenModalExitCar, onClose: onCloseModalExitCar } = useDisclosure();
    const [plateCar, setPlateCar] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [carros, setCarros] = React.useState<Carro[]>([]);
    const [selectedCarro, setSelectedCarro] = React.useState<Carro | null>(null);
    const [filterValue, setFilterValue] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const carros = await getCarros(id);
                    setCarros(carros);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error al obtener los datos:', error)
                }
            };

            fetchData();
        }
    }, [id]);

    const renderCell = React.useCallback((carro: Carro, columnKey: React.Key, role:any) => {
        const cellValue = carro[columnKey as keyof Carro];

        switch (columnKey) {
            case 'plateNumber':
                return (
                    <p>{cellValue}</p>
                );
            case 'entryTime':
                const fecha = new Date(cellValue);
                const fechaFormateada = `${agregarCeros(fecha.getUTCHours())}:${agregarCeros(fecha.getUTCMinutes())}`;
                return (
                    <p>{fechaFormateada}</p>
                );
            case 'exitTime':
                const fechaExit = new Date(cellValue);
                const fechaFormateadaExit = `${agregarCeros(fechaExit.getUTCHours())}:${agregarCeros(fechaExit.getUTCMinutes())}`;
                return (
                    <p>{fechaFormateadaExit}</p>
                );
            case 'price':
                return (
                    <p>{cellValue}</p>
                );
            case 'actions':
                return (
                    <div className="flex flex-row">
                        <Button onPress={() => openExitCar(carro,false)} className="mr-5">
                            <CurrencyDollarIcon aria-label="Salida sin ticket calcular precio" className='text-green-600' />
                        </Button>
                        <Button onPress={() => openExitCar(carro,true)} className="mr-5">
                            <TicketIcon aria-label="Salida con ticket, salida gratis" className='text-blue-500'  />
                        </Button>
                        {
                            role == "admin" || role == "owner" ?
                                <Button onPress={() => openModalDelete(carro)}>
                                    <TrashIcon aria-label="Eliminar carro" className='text-yellow-600' />
                                </Button> : <></>
                        }
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const openModalDelete = async (carro: Carro) => {
        setSelectedCarro(carro);
        onOpenModalDelete();
    };

    const openModalCreate = () => {
        onOpenModalCreate();
    };

    const openExitCar = async (carro: Carro,isFree:boolean) => {
        setSelectedCarro(carro);
        const salida = await exitCar(carro.plateNumber,isFree);
        setCarros(await getCarros(id));
        setPrice(salida.price);
        onOpenModalExitCar();
    };

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
    }, [])

    const filteredRegistros = carros.filter((carro) => {
        return carro.plateNumber.toLowerCase().includes(filterValue.toLowerCase());
    });

    const handleDelete = async () => {
        if (selectedCarro) {
            try {
                await deleteCar(selectedCarro._id);
                setCarros(carros.filter(reg => reg._id !== selectedCarro._id));
                onCloseModalDelete();
            } catch (error) {
                console.error('Error deleting data:', error);
                setError('Ocurrió un error al eliminar el carro');
                onCloseModalDelete();
            }
        }
    };

    const handleCreate = async () => {
        if (plateCar) {
            try {
                await addCar(plateCar);
                const carros = await getCarros(id);
                setCarros(carros);
                setPlateCar('');
                onCloseModalCreate();
            } catch (error) {
                console.error('Error deleting data:', error);
                setError('Ocurrió un error al agregar el carro');
                onCloseModalCreate();
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlateCar(event.target.value);
    };

    const handleCalculateTotal = async () => {
        try {
            await calculateTotal(id);
            router.push('/dashboard/');
        } catch (error) {
            console.error('Error al calcular el total:', error);
        }
    };

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar placa"
                        startContent={<MagnifyingGlassIcon className="size-6" />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button color="primary" startContent={<PlusIcon className="size-6" />} onPress={() => openModalCreate()} >
                            Agregar Carro
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [
        filterValue,
        onSearchChange
    ]);

    return (
        <div className='flex flex-col min-h-screen items-center'>
            <h1 className="my-3">Carros para el registro {id}</h1>
            <div className="flex mb-5 ">

                <Button color="success" onPress={handleCalculateTotal}>
                    Finalizar
                </Button>
            </div>

            <Table aria-label="Lista de carros" className='w-4/5 md:w-auto snap-x'
                classNames={{
                    base: "max-w-[97vw] md:w-auto max-h-[80vh]",
                }}
                topContent={topContent}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    isLoading={isLoading} loadingContent={<Spinner className="mt-10" label="Loading..." />}
                    items={filteredRegistros}
                >
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => <TableCell className="text-center" >{renderCell(item, columnKey, role)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <ToastContainer />
            <Modal
                isOpen={isOpenModalDelete}
                onClose={onCloseModalDelete}
            >
                <ModalContent>
                    <ModalHeader>Confirmar Eliminación</ModalHeader>
                    <ModalBody>
                        <p>¿Estás seguro de que deseas eliminar este carro?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={handleDelete}>
                            Eliminar
                        </Button>
                        <Button color="warning" onPress={onCloseModalDelete}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal
                isOpen={isOpenModalCreate}
                onClose={onCloseModalCreate}
            >
                <ModalContent>
                    <ModalHeader>Ingresa la placa del carro</ModalHeader>
                    <ModalBody>
                        <Input placeholder="Escribe la placa" value={plateCar} onChange={handleInputChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onPress={handleCreate}>
                            Agregar
                        </Button>
                        <Button color="danger" variant="light" onPress={onCloseModalCreate}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal
                isOpen={isOpenModalExitCar}
                onClose={onCloseModalExitCar}
            >
                <ModalContent>
                    <ModalHeader>Valor a cobrar</ModalHeader>
                    <ModalBody>
                        <p>{price}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="warning" onPress={onCloseModalExitCar}>
                            cerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};