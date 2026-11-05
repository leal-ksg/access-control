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

// usado pelo elemento Sidebar
export const navigationRoutes = [
    routes.dashboard,
    routes.users,
    routes.lockers,
    routes.logs
]