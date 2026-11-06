import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { UserRole } from "../models/enums";
import { routes } from "../routes/routes";

interface RequireRoleProps {
    roles: UserRole[]
    redirectTo?: string
    children: ReactNode
}

export default function RequireRole({ roles, redirectTo = routes.forbidden.path, children }: RequireRoleProps) {
    const { user } = useAuth()

    if (!user || !roles.includes(user.role)) {
        return <Navigate to={redirectTo} replace />
    }

    return children
}
