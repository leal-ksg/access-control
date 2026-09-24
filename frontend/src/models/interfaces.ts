import { DoorState, UserRole } from "./types"

export interface User {
    id: string
    name: string
    surname: string
    email: string
    active: boolean
    createdAt: string
    role: UserRole
}

export interface Locker {
    id: string
    name: string
    location: string
    deviceId: string | null
    doorState: DoorState
    createdAt: string
}

export interface AuthContextData {
    user: User | null
    login: () => void
    logout: () => void
}