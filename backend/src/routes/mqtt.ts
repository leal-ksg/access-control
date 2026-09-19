import * as deviceService from "../services/device-service";
import { MqttRouter } from "../core/mqtt-router";
import { prisma } from "../database/prisma";
import {
  DEVICE_OFFLINE_EVENT,
  DEVICE_VALIDATION_FAILED_EVENT,
} from "../constants";
import { createDeviceSchema } from "../schemas/device";
import { EventSeverity } from "../generated/prisma/client";

export const mqttRouter = new MqttRouter();

mqttRouter.on("devices/:deviceHash/status", async (params, payload) => {
  const { deviceHash } = params;

  /* Teoricamente, sempre vai ter um hash porque o broker nem chamaria esse tópico se não tivesse,
    mas a gente retorna só pro Typescript não reclamar
  */
  if (!deviceHash) return;

  if (payload.isOnline === true) {
    const validation = createDeviceSchema.safeParse(payload);

    if (!validation.success) {
      await prisma.event.create({
        data: {
          type: DEVICE_VALIDATION_FAILED_EVENT,
          message: `Os dados do dispositivo com hash ${deviceHash} não estão válidos para registro`,
          severity: EventSeverity.ERROR,
          metadata: JSON.stringify(validation.error),
        },
      });

      return;
    }

    await deviceService.registerDevice(payload);
    return;
  }

  await prisma.$transaction(async (transaction) => {
    const deviceExists = await transaction.device.findUnique({
      where: {
        deviceHash,
      },
    });

    if (!deviceExists) {
      return;
    }

    await transaction.device.update({
      where: { deviceHash },
      data: {
        isOnline: false,
        lastSeen: new Date(),
      },
    });

    await transaction.event.create({
      data: {
        type: DEVICE_OFFLINE_EVENT,
        message: `O dispositivo ${deviceExists.macAddress} ficou offline`,
        severity: EventSeverity.WARNING,
        deviceId: deviceExists.id,
      },
    });
  });
});
