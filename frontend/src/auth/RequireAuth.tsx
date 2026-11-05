import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { routes } from "../routes/routes";
import { ReactNode } from "react";
import LoadingElement from "../components/Loading";

export default function RequireAuth({ children }: { children: ReactNode }) {
    const { token, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <LoadingElement texto="Verificando sessão" />
        )
    }

    if (!token) {
        return (
            <Navigate
                to={routes.login.path}
                state={{ from: location }}
                replace
            />
        )
    }

    return children
}