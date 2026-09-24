import { LOCKER_PERMISSIONS_GRANTED_EVENT, LOCKER_PERMISSIONS_REVOKED_EVENT } from "../constants";
import { HttpError } from "../core/http-error";
import { prisma } from "../database/prisma";
import { EventSeverity, LockerPermission } from "../generated/prisma/client";
import { LockerPermissionDTO } from "../types/locker-permission";

export async function getPermissionsByUserId(
  userId: string,
): Promise<LockerPermission[]> {
  const permissions = await prisma.lockerPermission.findMany({
    where: {
      userId,
    },
  });

  return permissions;
}

export async function getPermissionsByLockerId(
  lockerId: string,
): Promise<LockerPermission[]> {
  const permissions = await prisma.lockerPermission.findMany({
    where: {
      lockerId,
    },
  });

  return permissions;
}

export async function upsertPermissions(
  lockerId: string,
  requesterUserId: string,
  permissions: LockerPermissionDTO[],
): Promise<void> {
  await prisma.$transaction(async (tx) => {
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
      },
      where: {
        id: {
          in: uniqueUsersIds,
        },
      },
    });

    if (uniqueUsersIds.length !== existingUsers.length)
      throw new HttpError(
        "Um ou mais usuários informados não existem no sistema",
      );

    await tx.lockerPermission.deleteMany({
      where: {
        lockerId,
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
        userId: requesterUserId,
        lockerId,
        type: LOCKER_PERMISSIONS_GRANTED_EVENT,
        severity: EventSeverity.WARNING,
        message: `Permissões concedidas ao armário ${existingLocker.name}.`,
        metadata: JSON.stringify(uniquePermissions),
      },
    });
  });
}

export async function revokePermissions(
  lockerId: string,
  requesterUserId: string,
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
      },
      where: {
        id: {
          in: uniqueUsersIds,
        },
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
        userId: requesterUserId,
        lockerId,
        type: LOCKER_PERMISSIONS_REVOKED_EVENT,
        severity: EventSeverity.WARNING,
        message: `Permissões de acesso ao armário ${existingLocker.name} revogadas.`,
        metadata: JSON.stringify(uniqueUsersIds),
      },
    });
  });
}
