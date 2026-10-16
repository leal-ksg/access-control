export const routes = {
    dashboard: {
        path: "/dashboard",
        name: "Dashboard"
    },
    users: {
        path: "/usuarios",
        name: "Usuários"
    },
    lockers: {
        path: "/armarios",
        name: "Armários"
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
        openLocker: (lockerId: string) => `/lockers/${lockerId}/unlock`
    }
}

// usado pelo elemento Sidebar
export const navigationRoutes = [
    routes.dashboard,
    routes.users,
    routes.lockers,
    routes.logs
]