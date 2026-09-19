import * as deviceService from "../services/device-service";
import { RegisterDeviceDTO } from "../types/device";

export async function registerDevice(device: RegisterDeviceDTO): Promise<void> {
  return await deviceService.registerDevice(device);
}
