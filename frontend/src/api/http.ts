import axios from "axios";
import { routes } from "../routes/routes";
import clearSession from "../utils/clearSession"

const login = routes.login.path
const forbidden = routes.forbidden.path

const redirect = (route: string) => window.location.assign(route)

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000
})

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config
})

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status

        switch (status) {
            case 401: // Unauthorized
                clearSession()
                if (window.location.pathname !== login) redirect(login);
                break
            case 403: // Forbidden
                if (window.location.pathname !== forbidden) redirect(forbidden);
                break

        }

        return Promise.reject(error)
    }
)