import { HttpError } from "../core/http-error";
import * as eventService from "../services/event-service";
import { Request, Response } from "express";
import { EventSeverity } from "../generated/prisma/client";

export async function getEvents(req: Request, res: Response) {
  const { type, userId, severity, startDate, endDate } = req.query;

  const filters: eventService.GetEventsFiltersDTO = {
    ...(type && { type: type as string }),
    ...(userId && { userId: userId as string }),
    ...(severity && { severity: severity as EventSeverity }),
    ...(startDate && { startDate: startDate as string }),
    ...(endDate && { endDate: endDate as string }),
  };

  const events = await eventService.getEvents(filters);

  return res.json(events);
}

export async function getEventById(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) {
    throw new HttpError("Informe o ID para buscar um evento");
  }

  const event = await eventService.getEventById(id);

  if (!event) {
    throw new HttpError("Evento não encontrado", 404);
  }

  return res.json(event);
}
