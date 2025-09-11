'use client';
import React from "react";
import {
    EyeSlashIcon,
    UserCircleIcon,
    EyeIcon,
} from "@heroicons/react/24/solid";
import { LoginInputs } from "@/types/auth";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { userSchema } from "@/validations/userSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import type { ModalContentState } from "@/types/modal";
import { useRouter  } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
    const { login } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRegisterLoading, setIsRegisterLoading] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const [modalContent, setModalContent] = React.useState<ModalContentState>({
        title: "",
        body: "",
    })
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({ resolver: zodResolver(userSchema) });
    const toggleVisibility = () => setIsVisible(!isVisible);
    const router = useRouter();

    const handleRegisterClick = () => setIsRegisterLoading(true);

    const onSubmit = async (formData: LoginInputs) => {
        try {
            setIsLoading(true);
            const loggedUser = await login(formData);
            
            setModalContent({
                title: "Inicio de Sesión Exitoso",
                body: `Bienvenido, ${loggedUser.username}`,
            });
            
            onOpen();
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            setModalContent({
                title: "Error en el Inicio de Sesión",
                body: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
            });
            onOpen();
        } finally {
            setIsLoading(false);
        }
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
                        <Button radius="sm" type="submit" className="mx-1" disabled={isLoading}>
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
