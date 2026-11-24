import { formatUserNames } from "./event-service";
import {
  LOCKER_PERMISSIONS_GRANTED_EVENT,
  LOCKER_PERMISSIONS_REVOKED_EVENT,
} from "../constants";
import { HttpError } from "../core/http-error";
import { prisma } from "../database/prisma";
import {
  EventSeverity,
  LockerPermission,
  UserRole,
} from "../generated/prisma/client";
import { LockerPermissionDTO } from "../types/locker-permission";
import { AuthenticatedUser } from "../types/user";
import { visibleUsersWhere } from "../core/root-user";

export async function validateLockerPermission(
  lockerId: string,
  userId: string,
) {
  const permission = await prisma.lockerPermission.findUnique({
    where: {
      lockerId_userId: {
        lockerId,
        userId,
      },
    },
    include: {
      user: {
        select: {
          active: true,
        },
      },
    },
  });

  if (!permission) {
    throw new HttpError("Você não tem acesso a esse armário");
  }

  if (!permission.user || !permission.user.active) {
    throw new HttpError(
      "Sua conta de usuário está inativa no sistema. Acesso recusado.",
      403,
    );
  }

  const isUserAuthorized =
    permission.expiresAt === null || permission.expiresAt > new Date();

  if (!isUserAuthorized) {
    throw new HttpError("Seu acesso a este armário expirou.");
  }
}

export async function getPermissionsByUserId(
  userId: string,
  requester?: AuthenticatedUser,
): Promise<LockerPermission[]> {
  const permissions = await prisma.lockerPermission.findMany({
    where: {
      userId,
      user: visibleUsersWhere(requester),
    },
  });

  return permissions;
}

export async function getPermissionsByLockerId(
  lockerId: string,
  requester?: AuthenticatedUser,
): Promise<LockerPermission[]> {
  const permissions = await prisma.lockerPermission.findMany({
    where: {
      lockerId,
      user: visibleUsersWhere(requester),
    },
  });

  return permissions;
}

// Usuários cujas permissões o solicitante pode gerenciar: o professor só
// alunos e a si mesmo; o admin todos os que enxerga (o root fica oculto).
function manageableUsersWhere(requester: AuthenticatedUser) {
  const teacherScope =
    requester.role === UserRole.TEACHER
      ? { OR: [{ role: UserRole.STUDENT }, { id: requester.id }] }
      : {};

  return { AND: [visibleUsersWhere(requester), teacherScope] };
}

export async function upsertPermissions(
  lockerId: string,
  requesterUser: AuthenticatedUser,
  permissions: LockerPermissionDTO[],
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    if (requesterUser.role === UserRole.STUDENT)
      throw new HttpError(
        "Você não pode conceder acesso a armários para outros usuários",
      );

    const existingLocker = await tx.locker.findUnique({
      select: {
        name: true,
      },
      where: {
        id: lockerId,
      },
    });

    if (!existingLocker) throw new HttpError("O armário não existe");

    const uniquePermissions = [
      ...new Map(
        permissions.map((permission) => [permission.userId, permission]),
      ).values(),
    ];

    const uniqueUsersIds = uniquePermissions.map(
      (permission) => permission.userId,
    );

    const existingUsers = await tx.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
      },
      where: {
        id: {
          in: uniqueUsersIds,
        },
        ...manageableUsersWhere(requesterUser),
      },
    });

    if (uniqueUsersIds.length !== existingUsers.length)
      throw new HttpError(
        requesterUser.role === UserRole.TEACHER
          ? "Professores só podem liberar acesso para alunos ou para si mesmos"
          : "Um ou mais usuários informados não existem no sistema",
      );

    // A lista enviada substitui as permissões do armário, mas só entre os
    // usuários que o solicitante gerencia: os demais acessos são mantidos.
    await tx.lockerPermission.deleteMany({
      where: {
        lockerId,
        user: manageableUsersWhere(requesterUser),
      },
    });

    await tx.lockerPermission.createMany({
      data: uniquePermissions.map((permission) => ({
        lockerId,
        userId: permission.userId,
        expiresAt: permission.expiresAt,
      })),
    });

    await tx.event.create({
      data: {
        userId: requesterUser.id,
        lockerId,
        type: LOCKER_PERMISSIONS_GRANTED_EVENT,
        severity: EventSeverity.WARNING,
        message: `Permissão de acesso ao armário ${existingLocker.name} concedida para ${formatUserNames(existingUsers)}.`,
        metadata: JSON.stringify(uniquePermissions),
      },
    });
  });
}

export async function revokePermissions(
  lockerId: string,
  requesterUser: AuthenticatedUser,
  userIds: string[],
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const existingLocker = await tx.locker.findUnique({
      select: { name: true },
      where: {
        id: lockerId,
      },
    });

    if (!existingLocker) throw new HttpError("O armário não existe");

    const uniqueUsersIds = [...new Set(userIds)];

    const existingUsers = await tx.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
      },
      where: {
        id: {
          in: uniqueUsersIds,
        },
        ...visibleUsersWhere(requesterUser),
      },
    });

    if (uniqueUsersIds.length !== existingUsers.length)
      throw new HttpError(
        "Um ou mais usuários informados não existem no sistema",
      );

    await tx.lockerPermission.deleteMany({
      where: {
        lockerId,
        userId: {
          in: uniqueUsersIds,
        },
      },
    });

    await tx.event.create({
      data: {
        userId: requesterUser.id,
        lockerId,
        type: LOCKER_PERMISSIONS_REVOKED_EVENT,
        severity: EventSeverity.WARNING,
        message: `Permissão de acesso ao armário ${existingLocker.name} removida de ${formatUserNames(existingUsers)}.`,
        metadata: JSON.stringify(uniqueUsersIds),
      },
    });
  });
}
