import { z } from "zod";

export const userSchema = z.object({
    username: z
        .string()
        .min(3, { message: "El nombre de usuario debe tener minimo 3 caracteres" })
        .max(20, { message: "El nombre de usuario debe tener maximo 20 caracteres" }),
    password: z
        .string()
        .min(6, { message: "La contraseña debe tener minimo 6 caracteres" })
        .max(20, { message: "La contraseña debe tener maximo 20 caracteres" }),
});
