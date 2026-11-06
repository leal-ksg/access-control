import { prisma } from "../database/prisma";
import { Event, EventSeverity } from "../generated/prisma/client";
import {
  LOCKER_PERMISSIONS_GRANTED_EVENT,
  LOCKER_PERMISSIONS_REVOKED_EVENT,
} from "../constants";

export interface GetEventsFiltersDTO {
  type?: string;
  userId?: string;
  lockerId?: string;
  severity?: EventSeverity;
  startDate?: Date | string;
  endDate?: Date | string;
}

export async function getEvents(
  filters: GetEventsFiltersDTO = {},
): Promise<Event[]> {
  const { type, userId, lockerId, severity, startDate, endDate } = filters;

  const whereClause: any = {};

  if (type) {
    whereClause.type = type;
  }

  if (userId) {
    whereClause.userId = userId;
  }

  if (lockerId) {
    whereClause.lockerId = lockerId;
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

  return describePermissionEvents(events);
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

export function formatUserNames(
  users: { name: string; surname: string }[],
): string {
  if (users.length === 0) return "nenhum usuário";

  const names = users.map((user) => `${user.name} ${user.surname}`.trim());

  if (names.length === 1) return names[0]!;

  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

// Os eventos de permissão guardam no metadata os usuários afetados:
// concedidas -> [{ userId, expiresAt }], revogadas -> [userId]
function extractUserIds(metadata: unknown): string[] {
  let parsed = metadata;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) =>
      typeof item === "string"
        ? item
        : (item as { userId?: unknown } | null)?.userId,
    )
    .filter((id): id is string => typeof id === "string");
}

async function describePermissionEvents<
  T extends Event & { locker: { name: string } | null },
>(events: T[]): Promise<T[]> {
  const permissionTypes = [
    LOCKER_PERMISSIONS_GRANTED_EVENT,
    LOCKER_PERMISSIONS_REVOKED_EVENT,
  ];

  const usersIdsByEvent = new Map<string, string[]>();

  for (const event of events) {
    if (permissionTypes.includes(event.type)) {
      usersIdsByEvent.set(event.id, extractUserIds(event.metadata));
    }
  }

  if (usersIdsByEvent.size === 0) return events;

  const users = await prisma.user.findMany({
    select: { id: true, name: true, surname: true },
    where: { id: { in: [...new Set([...usersIdsByEvent.values()].flat())] } },
  });

  const usersById = new Map(users.map((user) => [user.id, user]));

  return events.map((event) => {
    const userIds = usersIdsByEvent.get(event.id);

    if (!userIds) return event;

    const affectedUsers = userIds
      .map((id) => usersById.get(id))
      .filter((user) => user !== undefined);

    if (affectedUsers.length === 0) return event;

    const lockerName = event.locker?.name ?? "removido";
    const names = formatUserNames(affectedUsers);

    const message =
      event.type === LOCKER_PERMISSIONS_GRANTED_EVENT
        ? `Permissão de acesso ao armário ${lockerName} concedida para ${names}.`
        : `Permissão de acesso ao armário ${lockerName} removida de ${names}.`;

    return { ...event, message };
  });
}
