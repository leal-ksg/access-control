export const routes = {
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
    api: {
        login: "/auth/login",
        users: "/users",
        docs: "/docs",
        lockers: "/lockers",
        events: "/events",
        permissions: "/permissions",
        user: "/user", // relacionado com permissões
        locker: "/locker", // relacionado com permissões
        openLocker: (lockerId: string) => `/lockers/${lockerId}/unlock`
    },

}

// usado pelo elemento Sidebar
export const navigationRoutes = [
    routes.dashboard,
    routes.users,
    routes.lockers,
    routes.logs
]