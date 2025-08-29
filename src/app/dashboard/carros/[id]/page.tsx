'use client';

import { CurrencyDollarIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon, TicketIcon, EllipsisVerticalIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { addCar, calculateTotal, deleteCar, exitCar, getCarros } from "@/services/parkingCars";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useCallback, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner, Button, Dropdown, DropdownTrigger, SortDescriptor, DropdownMenu, DropdownItem, Input } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Carro } from '@/types/car';

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
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen: isOpenModalDelete, onOpen: onOpenModalDelete, onClose: onCloseModalDelete } = useDisclosure();
    const { isOpen: isOpenModalCreate, onOpen: onOpenModalCreate, onClose: onCloseModalCreate } = useDisclosure();
    const { isOpen: isOpenModalExitCar, onOpen: onOpenModalExitCar, onClose: onCloseModalExitCar } = useDisclosure();
    const [plateCar, setPlateCar] = useState('');
    const [price, setPrice] = useState('');
    const [carros, setCarros] = useState<Carro[]>([]);
    const [selectedCarro, setSelectedCarro] = useState<Carro | null>(null);
    const [filterValue, setFilterValue] = useState("");
    const [error, setError] = useState<string | null>(null);
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

    const openExitCar = useCallback(async (carro: Carro,isFree:boolean) => {
        setSelectedCarro(carro);
        const salida = await exitCar(carro.plateNumber,isFree);
        setCarros(await getCarros(id));
        setPrice(salida.price);
        onOpenModalExitCar();
    }, [id, onOpenModalExitCar]);

    const openModalDelete = useCallback(async (carro: Carro) => {
        setSelectedCarro(carro);
        onOpenModalDelete();
    }, [onOpenModalDelete]);

    const renderCell = useCallback((carro: Carro, columnKey: React.Key, role:any) => {
        const cellValue = carro[columnKey as keyof Carro];

        switch (columnKey) {
            case 'plateNumber':
                return (
                    <p>{cellValue}</p>
                );
            case 'entryTime':
                console.log('cellValue', cellValue);
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
                        <div className="relative flex justify-end items-center gap-2">
                            <Dropdown className="bg-background border-1 border-default-200">
                                <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <EllipsisVerticalIcon/>
                                </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label='Acciones del carro'
                                    onAction={(key)=>{
                                        console.log('Acción seleccionada:', key);
                                        switch (key) {
                                            case 'exit':
                                                openExitCar(carro,false);
                                                break;
                                            case 'ticket':
                                                openExitCar(carro,true);
                                                break;
                                            case 'comment':
                                                toast.info('Funcionalidad en desarrollo');
                                                break;
                                            case 'delete':
                                                openModalDelete(carro);
                                                break;
                                            default:
                                                console.log('Acción no reconocida');
                                        }
                                    }}
                                >
                                    <DropdownItem
                                        key="exit"
                                        className="text-success"
                                        color="success"
                                        startContent={
                                            <CurrencyDollarIcon 
                                            aria-label="Salida sin ticket calcular precio" 
                                            className="w-4 h-4" />
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
                                            className="w-4 h-4" />
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
                                            className="w-4 h-4" />
                                        }
                                    >
                                        Comentario
                                    </DropdownItem>
                                    {
                                        role == "admin" || role == "owner" ?
                                            <DropdownItem
                                                key="delete"
                                                className="text-danger"
                                                color="danger"
                                                startContent={
                                                    <TrashIcon 
                                                    aria-label="Eliminar carro" 
                                                    className="w-4 h-4" />
                                                }
                                            >
                                                Eliminar
                                            </DropdownItem> : <></>
                                    }
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        {/* <Button onPress={() => openExitCar(carro,false)} className="mr-5">
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
                        } */}
                    </div>
                );
            default:
                return cellValue;
        }
    }, [openExitCar,openModalDelete]);

    const openModalCreate = useCallback(() => {
        onOpenModalCreate();
    }, [onOpenModalCreate]);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
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
        onSearchChange,
        onClear,
        openModalCreate,
    ]);

    return (
        <div className='flex flex-col min-h-screen items-center m-2'>
            <h1 className="my-2">Carros para el registro {id}</h1>
            <div className="flex my-2 mb-4">
                <Button color="success" onPress={handleCalculateTotal}>
                    Finalizar
                </Button>
            </div>
            <Table aria-label="Lista de carros" className='md:w-auto snap-x'
                classNames={{
                    base: "max-w-[97vw] md:w-auto max-h-[80vh]",
                }}
                topContent={topContent}
                topContentPlacement="outside"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={"center"}>
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