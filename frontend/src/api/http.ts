import axios from "axios";
import { routes } from "../routes/routes";
import clearSession from "../utils/clearSession"

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
        switch (error?.response?.status) {
            case 401: // Unauthorized
                clearSession()
                if (window.location.pathname !== routes.login.path) redirect(routes.login.path);
                break
            case 403: // Forbidden
                if (window.location.pathname !== routes.forbidden.path) redirect(routes.forbidden.path);
                break

        }

        return Promise.reject(error)
    }
)