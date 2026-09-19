import { DEVICE_ONLINE_EVENT, DEVICE_REGISTERED_EVENT } from "../constants";
import { prisma } from "../database/prisma";
import { EventSeverity } from "../generated/prisma/client";
import { RegisterDeviceDTO } from "../types/device";

export async function registerDevice(device: RegisterDeviceDTO): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    const registeredDevice = await transaction.device.findUnique({
      where: { deviceHash: device.deviceHash },
    });

    if (registeredDevice) {
      if (!registeredDevice.isOnline) {
        await transaction.device.update({
          where: { id: registeredDevice.id },
          data: { isOnline: true, lastSeen: new Date() },
        });

        await transaction.event.create({
          data: {
            type: DEVICE_ONLINE_EVENT,
            message: `Dispositivo ${registeredDevice.macAddress} online`,
            severity: EventSeverity.INFO,
            deviceId: registeredDevice.id,
          },
        });
      } else {
        await transaction.device.update({
          where: { id: registeredDevice.id },
          data: { lastSeen: new Date() },
        });
      }

      return;
    }

    const createdDevice = await transaction.device.create({
      data: device,
    });

    await transaction.event.create({
      data: {
        type: DEVICE_REGISTERED_EVENT,
        message: `Novo dispositivo (${createdDevice.macAddress}) registrado`,
        severity: EventSeverity.INFO,
        deviceId: createdDevice.id,
      },
    });
  });
}
