import { Locker, User } from "./interfaces"

export const users: User[] = [
    {
        id: "user-1",
        name: "Admin",
        surname: "Sistema",
        email: "admin@example.com",
        active: true,
        createdAt: "2026-09-01T10:00:00Z",
        role: "ADMIN",
    },
    {
        id: "user-2",
        name: "João",
        surname: "Professor",
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

export const lockers: Locker[] = [
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