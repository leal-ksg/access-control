import { Locker, User } from "../models/interfaces"

export const mockUsers: User[] = [
    {
        id: "user-1",
        name: "João",
        surname: "Silva",
        email: "admin@example.com",
        active: true,
        createdAt: "2026-09-01T10:00:00Z",
        role: "ADMIN",
    },
    {
        id: "user-2",
        name: "Amanda",
        surname: "Santos",
        email: "professor@example.com",
        active: true,
        createdAt: "2026-09-02T10:00:00Z",
        role: "TEACHER",
    },
    {
        id: "user-3",
        name: "Maria",
        surname: "Silva",
        email: "maria@example.com",
        active: true,
        createdAt: "2026-09-03T10:00:00Z",
        role: "STUDENT",
    },
]

export const mockLockers: Locker[] = [
    {
        id: "locker-1",
        name: "Armário 01",
        location: "Laboratório PIPA",
        deviceId: "device-1",
        doorState: "CLOSED",
        createdAt: "2026-09-01T10:00:00Z",
    },
    {
        id: "locker-2",
        name: "Armário 02",
        location: "Laboratório PIPA",
        deviceId: "device-2",
        doorState: "OPEN",
        createdAt: "2026-09-01T10:10:00Z",
    },
    {
        id: "locker-3",
        name: "Armário 03",
        location: "Sala de Eletrônica",
        deviceId: null,
        doorState: "CLOSED",
        createdAt: "2026-09-01T10:20:00Z",
    },
]