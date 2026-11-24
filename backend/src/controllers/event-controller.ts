import { HttpError } from "../core/http-error";
import * as eventService from "../services/event-service";
import { Request, Response } from "express";
import { EventSeverity } from "../generated/prisma/client";

function filtersFromQuery(
  query: Request["query"],
): eventService.GetEventsFiltersDTO {
  const { type, userId, lockerId, severity, startDate, endDate } = query;

  return {
    ...(type && { type: type as string }),
    ...(userId && { userId: userId as string }),
    ...(lockerId && { lockerId: lockerId as string }),
    ...(severity && { severity: severity as EventSeverity }),
    ...(startDate && { startDate: startDate as string }),
    ...(endDate && { endDate: endDate as string }),
  };
}

export async function getEvents(req: Request, res: Response) {
  const events = await eventService.getEvents(
    filtersFromQuery(req.query),
    req.user,
  );

  return res.json(events);
}

export async function deleteEvents(req: Request, res: Response) {
  const deleted = await eventService.deleteEvents(
    filtersFromQuery(req.query),
    req.user!,
  );

  return res.json({ deleted });
}

export async function getEventById(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) {
    throw new HttpError("Informe o ID para buscar um evento");
  }

  const event = await eventService.getEventById(id, req.user);

  if (!event) {
    throw new HttpError("Evento não encontrado", 404);
  }

  return res.json(event);
}
