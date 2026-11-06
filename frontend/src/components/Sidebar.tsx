import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { navigationRoutes } from "../routes/routes";
import { useAuth } from "../auth/AuthContext";

interface SidebarProps {
    open?: boolean
    collapsed?: boolean
    onClose?: () => void
    onToggleCollapse?: () => void
}

export default function Sidebar({ open = false, collapsed = false, onClose, onToggleCollapse }: SidebarProps) {
    const { user } = useAuth()

    const visibleRoutes = navigationRoutes.filter(
        route => user && route.roles.includes(user.role)
    )

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
                className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-y-auto bg-primary text-white transition-all duration-200 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 ${collapsed ? "md:w-18" : "md:w-50"} ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <nav className="flex flex-1 flex-col gap-5 p-4">
                    {visibleRoutes.map((route) => {
                        const Icon = route.icon

                        return (
                            <NavLink
                                key={route.path}
                                to={route.path}
                                onClick={onClose}
                                title={collapsed ? route.name : undefined}
                                className={({ isActive }) =>
                                    `flex w-full items-center gap-3 rounded bg-[var(--button)] py-2 transition duration-200 ${collapsed ? "px-5 md:justify-center md:px-0" : "px-5"} ${isActive
                                        ? "font-medium bg-[var(--dark-line)] text-black"
                                        : "hover:bg-[var(--button-hover)]"
                                    }`}
                            >
                                <Icon size={20} className="shrink-0" />
                                <span className={collapsed ? "md:hidden" : ""}>{route.name}</span>
                            </NavLink>
                        )
                    })}
                </nav>

                {onToggleCollapse && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label={collapsed ? "Expandir menu" : "Ocultar menu"}
                        title={collapsed ? "Expandir menu" : "Ocultar menu"}
                        className={`m-4 hidden items-center gap-3 rounded py-2 hover:bg-white/20 md:flex ${collapsed ? "justify-center" : "px-5"}`}
                    >
                        {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                        {!collapsed && <span className="text-sm">Ocultar</span>}
                    </button>
                )}
            </aside>
        </>
    )
}
