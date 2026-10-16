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