import { prisma } from "../database/prisma";
import { Event, EventSeverity } from "../generated/prisma/client";

export interface GetEventsFiltersDTO {
  type?: string;
  userId?: string;
  severity?: EventSeverity;
  startDate?: Date | string;
  endDate?: Date | string;
}

export async function getEvents(
  filters: GetEventsFiltersDTO = {},
): Promise<Event[]> {
  const { type, userId, severity, startDate, endDate } = filters;

  const whereClause: any = {};

  if (type) {
    whereClause.type = type;
  }

  if (userId) {
    whereClause.userId = userId;
  }

  if (severity) {
    whereClause.severity = severity;
  }

  if (startDate || endDate) {
    whereClause.createdAt = {};

    if (startDate) {
      if (typeof startDate === "string") {
        const dateStr = startDate.includes("T")
          ? startDate
          : `${startDate}T00:00:00.000-03:00`;
        whereClause.createdAt.gte = new Date(dateStr);
      } else {
        whereClause.createdAt.gte = startDate;
      }
    }

    if (endDate) {
      if (typeof endDate === "string") {
        const dateStr = endDate.includes("T")
          ? endDate
          : `${endDate}T23:59:59.999-03:00`;
        whereClause.createdAt.lte = new Date(dateStr);
      } else {
        whereClause.createdAt.lte = endDate;
      }
    }
  }

  const events = await prisma.event.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      locker: {
        select: {
          name: true,
        },
      },
    },
  });

  return events;
}

export async function getEventById(id: string): Promise<Event | null> {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      locker: true,
      device: true,
    },
  });

  return event;
}
