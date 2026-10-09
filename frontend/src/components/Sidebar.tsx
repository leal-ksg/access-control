import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { navigationRoutes } from "../routes/routes";

export default function Sidebar() {
    // ARRUMAR PERMISSÕES DE ACESSO
    const { user } = useAuth()

    return (
        <aside className="w-50 shrink-0 bg-primary text-white">
            <nav className="flex flex-col gap-5 p-4">
                {navigationRoutes.map((route) => (
                    <NavLink
                        key={route.path}
                        to={route.path}
                        className={({ isActive }) =>
                            `w-full rounded bg-[#293763] px-5 py-2 ${isActive
                                ? "font-medium"
                                : "hover:bg-[#344573]"
                            }`}
                    >
                        {route.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}