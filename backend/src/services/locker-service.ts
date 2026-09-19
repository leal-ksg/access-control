import { gt } from "zod";
import { HttpError } from "../core/http-error";
import { prisma } from "../database/prisma";
import { EventSeverity, Locker } from "../generated/prisma/client";
import mqttClient from "../mqtt/config";
import { LOCKER_UNLOCKED_EVENT, UNLOCK_LOCKER_TOPIC } from "../constants";

export async function getLockers(): Promise<Locker[]> {
  const lockers = await prisma.locker.findMany();

  return lockers;
}

export async function getLockerById(id: string): Promise<Locker | null> {
  const locker = await prisma.locker.findUnique({
    where: { id },
  });

  return locker;
}

export async function createLocker(data: Omit<Locker, "id">): Promise<Locker> {
  if (data.deviceId) {
    const deviceAlreadyLinked = await prisma.locker.findFirst({
      where: { deviceId: data.deviceId },
    });

    if (deviceAlreadyLinked) {
      throw new HttpError(
        "O dispositivo escolhido já está vinculado em outro armário",
      );
    }
  }

  const newLocker = await prisma.locker.create({
    data,
  });

  return newLocker;
}

export async function updateLocker(
  id: string,
  data: Omit<Partial<Locker>, "id">,
): Promise<void> {
  if (data.deviceId) {
    const deviceAlreadyLinked = await prisma.locker.findFirst({
      where: { deviceId: data.deviceId, id: { not: id } },
    });

    if (deviceAlreadyLinked) {
      throw new HttpError(
        "O dispositivo escolhido já está vinculado em outro armário",
      );
    }

    const deviceExists = await prisma.device.findFirst({
      where: {
        id: data.deviceId,
      },
    });

    if (!deviceExists) {
      throw new HttpError("O dispositivo associado ao armário não existe");
    }
  }

  await prisma.locker.update({
    where: { id },
    data,
  });
}

export async function deleteLocker(id: string): Promise<void> {
  await prisma.locker.delete({
    where: { id },
  });
}

export async function unlockLocker(lockerId: string, userId: string) {
  const locker = await prisma.locker.findUnique({
    where: { id: lockerId },
    include: { device: true },
  });

  if (!locker) throw new HttpError("O armário solicitado não foi encontrado");

  const permission = await prisma.lockerPermission.findUnique({
    where: {
      lockerId_userId: {
        lockerId,
        userId,
      },
    },
  });

  if (!permission) {
    throw new HttpError("Você não tem permissão para abrir esse armário");
  }

  const isUserAuthorized =
    permission.expiresAt === null || permission.expiresAt > new Date();

  if (!isUserAuthorized) {
    throw new HttpError("Sua permissão de acesso para este armário expirou.");
  }

  const { device } = locker;

  if (!device)
    throw new HttpError("O armário não possui nenhum dispositivo vinculado");

  if (!device.isOnline)
    throw new HttpError(
      "O dispositivo desse armário não está online no momento",
    );

  const payload = {
    cmd: "UNLOCK",
  };

  mqttClient.publish(
    `${UNLOCK_LOCKER_TOPIC}/${device.deviceHash}`,
    JSON.stringify(payload),
    { qos: 1, retain: false },
  );

  await prisma.event.create({
    data: {
      type: LOCKER_UNLOCKED_EVENT,
      message: `Comando de abertura disparado para o dispositivo ${device.macAddress}`,
      severity: EventSeverity.INFO,
      deviceId: device.id,
      lockerId,
      userId,
    },
  });
}
