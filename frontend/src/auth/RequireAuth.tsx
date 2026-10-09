import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { routes } from "../routes/routes";
import { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

export default function RequireAuth({ children }: { children: ReactNode }) {
    const { token, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3">
                <LoaderCircle className="h-8 w-8 animate-spin" />
                <p className="text-2xl font-medium text-gray-600">Verificando sessão</p>
            </div>
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