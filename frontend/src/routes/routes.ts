export const routes = {
    dashboard: {
        path: "/",
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
    }
}

// usado pelo elemento Sidebar
export const navigationRoutes=[
    routes.dashboard,
    routes.users,
    routes.lockers,
    routes.logs
]