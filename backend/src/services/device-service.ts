import { DEVICE_ONLINE_EVENT, DEVICE_REGISTERED_EVENT } from "../constants";
import { prisma } from "../database/prisma";
import { Device, EventSeverity } from "../generated/prisma/client";
import { RegisterDeviceDTO } from "../types/device";

export async function registerDevice(device: RegisterDeviceDTO): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const registeredDevice = await tx.device.findUnique({
      where: { deviceHash: device.deviceHash },
    });

    if (registeredDevice) {
      if (!registeredDevice.isOnline) {
        await tx.device.update({
          where: { id: registeredDevice.id },
          data: { isOnline: true, lastSeen: new Date() },
        });

        await tx.event.create({
          data: {
            type: DEVICE_ONLINE_EVENT,
            message: `Dispositivo ${registeredDevice.macAddress} online`,
            severity: EventSeverity.INFO,
            deviceId: registeredDevice.id,
          },
        });
      } else {
        await tx.device.update({
          where: { id: registeredDevice.id },
          data: { lastSeen: new Date() },
        });
      }

      return;
    }

    const createdDevice = await tx.device.create({
      data: device,
    });

    await tx.event.create({
      data: {
        type: DEVICE_REGISTERED_EVENT,
        message: `Novo dispositivo (${createdDevice.macAddress}) registrado`,
        severity: EventSeverity.INFO,
        deviceId: createdDevice.id,
      },
    });
  });
}

export async function getUnlinkedDevices(): Promise<Device[]> {
  const unlinkedDevices = await prisma.device.findMany({
    where: {
      locker: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return unlinkedDevices;
}
