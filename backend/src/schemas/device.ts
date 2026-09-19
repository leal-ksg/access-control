import * as z from "zod";

export const createDeviceSchema = z.object({
  deviceHash: z
    .string("Informe o hash do dispositivo")
    .min(1, "O código hash do dispositivo é obrigatório"),
  macAddress: z
    .mac("Endereço MAC do dispositivo inválido")
    .min(1, "O endereço MAC do dispositivo é obrigatório"),
  isOnline: z.boolean("Informe se o dispositivo está online ou não"),
});
