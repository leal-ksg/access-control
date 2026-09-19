import * as z from "zod";
import { UserRole } from "../generated/prisma/enums";

export const createLockerSchema = z.object({
  name: z
    .string("Informe o nome do armário")
    .min(1, "O nome do armário é obrigatório"),
  location: z
    .string("Informe a localização do armário")
    .min(1, "A localização do armário é obrigatória"),
  deviceId: z
    .cuid2("Identificação do dispositivo inválida")
    .nullable()
    .optional(),
});

export const updateLockerSchema = createLockerSchema.partial();
