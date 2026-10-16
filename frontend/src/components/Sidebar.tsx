import { NavLink } from "react-router-dom";
import { navigationRoutes } from "../routes/routes";

export default function Sidebar() {
    // ARRUMAR PERMISSÕES DE ACESSO
    return (
        <aside className="w-50 shrink-0 bg-primary text-white">
            <nav className="flex flex-col gap-5 p-4">
                {navigationRoutes.map((route) => (
                    <NavLink
                        key={route.path}
                        to={route.path}
                        className={({ isActive }) =>
                            `w-full rounded bg-[var(--button)] px-5 py-2 ${isActive
                                ? "font-medium"
                                : "hover:bg-[var(--button-hover)]"
                            }`}
                    >
                        {route.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}