'use client';
import React from "react";
import {
    EyeSlashIcon,
    UserCircleIcon,
    EyeIcon,
} from "@heroicons/react/24/solid";
import { RegisterInputs } from "@/types/auth";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/validations/registerSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import type { ModalContentState } from "@/types/modal";
import { registerFetch } from "@/services/auth";

export default function Register() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoginLoading, setIsLoginLoading] = React.useState(false);
    const [isVisiblePassword, setIsVisiblePassword] = React.useState(false);
    const [isVisibleConfirmPassword, setIsVisibleConfirmassword] = React.useState(false);
    const [modalContent, setModalContent] = React.useState<ModalContentState>({
        title: "",
        body: "",
    })

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterInputs>({ resolver: zodResolver(registerSchema) });

    const toggleVisibilityPassword = () => setIsVisiblePassword(!isVisiblePassword);
    const toggleVisibilityConfirmPassword = () => setIsVisibleConfirmassword(!isVisibleConfirmPassword);

    const onSubmit = async (formData: RegisterInputs) => {
        try {
            setIsLoading(true);
            const response = await registerFetch(formData);

            console.log('Register successful', response);
            setModalContent({
                title: "Registro Exitoso",
                body: "Bienvenido, te has registrado correctamente.",
            });
        } catch (error) {
            console.error('Register failed:', error);
            setModalContent({
                title: "Error en el Registro",
                body: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
            });
        } finally {
            setIsLoading(false);
        }
        onOpen();
    };

    const handleLoginClick = () => {
        setIsLoginLoading(true);
    }

    return (
        <>
            <Card className="flex flex-col w-4/5 md:w-2/5 rounded-xl p-5 md:p-10 ">
                <CardHeader>
                    <h1 className="grow text-2xl md:text-5xl font-bold text-center my-5 ">
                        REGISTRATE
                    </h1>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody>
                        <Input
                            type="text"
                            variant="bordered"
                            label="Nombre de usuario:"
                            autoComplete="username"
                            className="my-3"
                            endContent={
                                <UserCircleIcon className="size-6 text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            isInvalid={errors.username && true}
                            errorMessage={errors.username?.message}
                            {...register("username")}
                        />
                        <Input
                            label="Contraseña:"
                            variant="bordered"
                            autoComplete="new-password"
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibilityPassword}
                                >
                                    {isVisiblePassword ? (
                                        <EyeSlashIcon className="size-6 text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeIcon className="size-6 text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            isInvalid={errors.password && true}
                            errorMessage={errors.password?.message}
                            type={isVisiblePassword ? "text" : "password"}
                            className="my-3"
                            {...register("password")}
                        />
                        <Input
                            label="Confirmar contraseña:"
                            variant="bordered"
                            autoComplete="new-password"
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibilityConfirmPassword}
                                >
                                    {isVisibleConfirmPassword ? (
                                        <EyeSlashIcon className="size-6 text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeIcon className="size-6 text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisibleConfirmPassword ? "text" : "password"}
                            isInvalid={errors.confirmPassword && true}
                            errorMessage={errors.confirmPassword?.message}
                            className="my-3"
                            {...register("confirmPassword")}
                        />
                    </CardBody>
                    <CardFooter className="justify-center">
                        <Button radius="sm" type="submit" className="mx-1">
                            {isLoading ? <Spinner /> : 'Registrarse'}
                        </Button>
                        <Button
                            as={Link}
                            href="/auth/login"
                            radius="sm"
                            className="mx-1"
                            variant="bordered"
                            onClick={handleLoginClick}
                            disabled={isLoginLoading} // Deshabilita el botón mientras se carga
                            >
                                {isLoginLoading ? <Spinner /> : 'Iniciar Sesion'}
                            
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
