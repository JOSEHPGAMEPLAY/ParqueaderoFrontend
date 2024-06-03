'use client'

import React from "react";
import {
    EyeSlashIcon,
    UserCircleIcon,
    EyeIcon,
} from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { userSchema } from "@/validations/userSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import ModalContentState from "@/validations/interfacemodal";
import { useRouter  } from 'next/navigation';

type Inputs = {
    username: string,
    password: string,
}

async function loginFetch(credentials: Inputs) {
    const { username, password } = credentials;

    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            username,
            password,
        });

        return res.data;
    } catch (error) {
         console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error en la solicitud');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
}

export default function Login() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRegisterLoading, setIsRegisterLoading] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const [modalContent, setModalContent] = React.useState<ModalContentState>({
        title: "Iniciar Sesión",
        body: "",
    })
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(userSchema) });
    const toggleVisibility = () => setIsVisible(!isVisible);
    const router = useRouter();

    const handleRegisterClick = () => {
        setIsRegisterLoading(true);
    }

    const onSubmit = async (formData: Inputs) => {
        try {
            setIsLoading(true);
            const response = await loginFetch(formData);
            localStorage.setItem('token', response.token);
            console.log('Login successful', response);
            setModalContent({
                title: "Inicio de Sesión Exitoso",
                body: "Bienvenido, has iniciado sesión correctamente.",
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            setModalContent({
                title: "Error en el Inicio de Sesión",
                body: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
            });
        } finally {
            setIsLoading(false);
        }
        onOpen();
    };

    return (
        <>
            <Card className="flex flex-col w-4/5 md:w-2/5 rounded-xl p-5 md:p-10 ">
                <CardHeader>
                    <h1 className="grow text-2xl md:text-5xl font-bold text-center my-5 ">
                        INICIAR SESION
                    </h1>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <CardBody>
                        <Input
                            type="text"
                            variant="bordered"
                            label="Nombre de usuario:"
                            autoComplete="username"
                            className="my-3"
                            isInvalid={errors.username && true}
                            errorMessage={errors.username?.message}
                            endContent={
                                <UserCircleIcon className="size-6 text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            {...register("username")}
                        />
                        <Input
                            label="Contraseña:"
                            variant="bordered"
                            autoComplete="current-password"
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}
                                >
                                    {isVisible ? (
                                        <EyeSlashIcon className="size-6 text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeIcon className="size-6 text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="my-3"
                            isInvalid={errors.username && true}
                            errorMessage={errors.password?.message}
                            {...register("password")}
                        />
                    </CardBody>
                    <CardFooter className="justify-center">
                        <Button radius="sm" type="submit" className="mx-1">
                            {isLoading ? <Spinner /> : 'Ingresar'}
                        </Button>
                        <Button
                            as={Link}
                            href="/auth/register"
                            radius="sm"
                            className="mx-1"
                            variant="bordered"
                            onClick={handleRegisterClick}
                            disabled={isRegisterLoading} // Deshabilita el botón mientras se carga
                            >
                                {isRegisterLoading ? <Spinner /> : 'Registrarme'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>{modalContent.title}</ModalHeader>
                    <ModalBody>
                        <p>{modalContent.body}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={onClose}>cerrar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
