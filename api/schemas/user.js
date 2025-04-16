import { z } from 'zod';

export const userRegisterSchema = z.object({
  username: z.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no debe superar los 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"),

  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña es demasiado larga"),

  img: z.string()
    .url("La imagen debe ser una URL válida")
    .optional()
});


export const userLoginSchema = z.object({
  username: z.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),

  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
});