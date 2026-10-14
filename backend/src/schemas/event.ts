import { z } from "zod";
import { EventSeverity } from "../generated/prisma/client";

export const getEventsQuerySchema = z
  .object({
    type: z.string().optional(),
    userId: z.cuid2().optional(),
    severity: z.enum(EventSeverity).optional(),
    startDate: z.iso
      .datetime({ message: "Data inicial deve estar no formato ISO" })
      .optional(),
    endDate: z.iso
      .datetime({ message: "Data final deve estar no formato ISO" })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) {
        return true;
      }
      return data.startDate <= data.endDate;
    },
    {
      message: "A data inicial não pode ser maior que a data final ",
      path: ["startDate"],
    },
  );
