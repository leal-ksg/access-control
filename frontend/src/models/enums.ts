export enum UserRole {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT"
}

export enum DoorState {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}

export enum EventSeverity {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR"
}

export function prettyRole(role: UserRole): string {
    switch (role) {
        case UserRole.ADMIN: return "Administrador"
        case UserRole.TEACHER: return "Professor"
        case UserRole.STUDENT: return "Estudante"
    }
}

export function prettyDoorState(state: DoorState): string {
    switch (state) {
        case DoorState.OPEN: return "Aberto"
        case DoorState.CLOSED: return "Fechado"
    }
}

export function prettySeverity(severity: EventSeverity): string {
    switch (severity) {
        case EventSeverity.INFO: return "Informativo"
        case EventSeverity.WARNING: return "Aviso"
        case EventSeverity.ERROR: return "Erro"
    }
}

export const EVENT_TYPES: Record<string, string> = {
    LOCKER_UNLOCKED: "Armário aberto",
    LOCKER_PERMISSIONS_GRANTED: "Permissões concedidas",
    LOCKER_PERMISSIONS_REVOKED: "Permissões revogadas",
    DEVICE_BACK_ONLINE: "Dispositivo online",
    DEVICE_OFFLINE: "Dispositivo offline",
    DEVICE_REGISTERED: "Dispositivo registrado",
    DEVICE_VALIDATION_FAILED: "Dados do dispositivo inválidos",
    DEVICE_REGISTER_FAILED: "Falha ao registrar dispositivo",
}

export function prettyEventType(type: string): string {
    return EVENT_TYPES[type] ?? type
}
