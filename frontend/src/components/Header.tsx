import { LogOut, Menu, User } from "lucide-react"
import { useAuth } from "../auth/AuthContext"
import { prettyRole } from "../models/enums"
import { Link } from "react-router-dom"
import { routes } from "../routes/routes"

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const { user, logout } = useAuth()
    const iconSize: number = 18

    return (
        <header className="sticky top-0 z-40 w-full bg-primary text-white">
            <div className="flex h-16 items-center justify-between gap-2 px-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-2">
                    {onMenuClick && (
                        <button
                            type="button"
                            onClick={onMenuClick}
                            aria-label="Abrir menu"
                            className="rounded p-2 hover:bg-white/20 md:hidden"
                        >
                            <Menu size={24} />
                        </button>
                    )}
                    <span className="truncate text-base font-semibold sm:text-lg">
                        <span className="hidden sm:inline">Access Control - </span>
                        {user ? prettyRole(user.role) : "Login"}
                    </span>
                </div>
                {user && (
                    <div className="flex shrink-0 items-center gap-1 sm:gap-10">
                        <Link
                            className="flex items-center gap-2 rounded p-3 text-sm font-medium hover:bg-white/20"
                            to={`${routes.users.path}/${user?.id}`}
                            aria-label="Meu perfil"
                        >
                            <span className="hidden max-w-[200px] truncate sm:inline">{user?.name} {user?.surname}</span>
                            <User size={iconSize} />
                        </Link>

                        <button
                            type="button"
                            onClick={logout}
                            aria-label="Sair"
                            className="flex items-center gap-2 rounded p-3 hover:bg-white/20"
                        >
                            <span className="hidden sm:inline">Sair</span>
                            <LogOut size={iconSize} />
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
