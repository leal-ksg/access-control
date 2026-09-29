import { DoorState, EventSeverity, UserRole } from "./types"

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
    token: string | null
    loading: boolean
    login: () => void
    logout: () => void
}

export interface Event {
    id: string
    correlationId: string | null
    type: string
    severity: EventSeverity
    message: string | null
    userId: string | null
    lockerId: string | null
    deviceId: string | null
    metadata: Record<string, unknown> | null
    createdAt: string
}