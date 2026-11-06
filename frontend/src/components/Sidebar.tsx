import { NavLink } from "react-router-dom";
import { navigationRoutes } from "../routes/routes";

interface SidebarProps {
    open?: boolean
    onClose?: () => void
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
    // ARRUMAR PERMISSÕES DE ACESSO
    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 top-16 z-30 bg-black/50 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed top-16 bottom-0 left-0 z-40 w-64 shrink-0 overflow-y-auto bg-primary text-white transition-transform duration-200 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-50 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <nav className="flex flex-col gap-5 p-4">
                    {navigationRoutes.map((route) => (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `w-full rounded bg-[var(--button)] px-5 py-2 transition duration-200 ${isActive
                                    ? "font-medium bg-[var(--dark-line)] text-black"
                                    : "hover:bg-[var(--button-hover)]"
                                }`}
                        >
                            {route.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    )
}
