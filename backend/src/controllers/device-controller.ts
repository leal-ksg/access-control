import { Request, Response } from "express";
import * as deviceService from "../services/device-service";
import { RegisterDeviceDTO } from "../types/device";

export async function registerDevice(device: RegisterDeviceDTO): Promise<void> {
  return await deviceService.registerDevice(device);
}

export async function getUnlinkedDevices(req: Request, res: Response) {
  const devices = await deviceService.getUnlinkedDevices();

  return res.json(devices);
}
