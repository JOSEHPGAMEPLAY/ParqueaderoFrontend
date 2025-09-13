import { z } from "zod";

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, { message: "El nombre de usuario debe tener minimo 3 caracteres" })
            .max(20, { message: "El nombre de usuario debe tener maximo 20 caracteres" }),
        password: z
            .string()
            .min(6, { message: "La contraseña debe tener minimo 6 caracteres" })
            .max(20, { message: "La contraseña debe tener maximo 20 caracteres" }),
        confirmPassword: z
            .string()
            .min(6, { message: "La contraseña debe tener minimo 6 caracteres" })
            .max(20, { message: "La contraseña debe tener maximo 20 caracteres" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });
