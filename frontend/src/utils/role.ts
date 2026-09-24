import { UserRole } from "../models/types";

const roleNames: Record<UserRole, string> = {
    ADMIN: "Administrador",
    TEACHER: "Professor",
    STUDENT: "Estudante"
}

export default function beautifyRole(role: UserRole) {
    return roleNames[role]
}