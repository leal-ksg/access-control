import { CalendarClock, LayoutDashboard, LockKeyhole, LucideIcon, Users } from "lucide-react"
import { UserRole } from "../models/enums"

export const routes = {
    // frontend
    dashboard: {
        path: "/dashboard",
        name: "Dashboard"
    },
    users: {
        path: "/usuarios",
        name: "Usuários",
        editPath: "/usuarios/editar",
        createPath: "/usuarios/criar"
    },
    lockers: {
        path: "/armarios",
        name: "Armários",
        editPath: "/armarios/editar",
        createPath: "/armarios/criar"
    },
    logs: {
        path: "/eventos",
        name: "Eventos"
    },
    login: {
        path: "/login",
        name: "Login"
    },
    forbidden: {
        path: "/proibido",
        name: "Proibido"
    },

    // backend
    api: {
        login: "/auth/login",
        docs: "/docs",
        events: "/events",
        permissions: "/permissions",

        users: "/users",
        userPerms: "/user",

        lockers: "/lockers",
        lockerPerms: "/locker",
        openLocker: (lockerId: string) => `/lockers/${lockerId}/unlock`,

        devices: "/devices/unlinked"
    },
}

export interface NavigationRoute {
    path: string
    name: string
    icon: LucideIcon
    roles: UserRole[]
}

const ALL_ROLES = Object.values(UserRole)

// usado pelo elemento Sidebar
export const navigationRoutes: NavigationRoute[] = [
    { ...routes.dashboard, icon: LayoutDashboard, roles: [UserRole.ADMIN] },
    { ...routes.users, icon: Users, roles: [UserRole.ADMIN] },
    { ...routes.lockers, icon: LockKeyhole, roles: ALL_ROLES },
    { ...routes.logs, icon: CalendarClock, roles: [UserRole.ADMIN] }
]