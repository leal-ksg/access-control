import { Device, Locker } from "../generated/prisma/client"

export type GetLockersDTO = Locker & {
    device: Device | null
}