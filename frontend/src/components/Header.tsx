import { LogOut, User } from "lucide-react"
import { useAuth } from "../auth/AuthContext"
import { prettyRole } from "../models/enums"
import { Link } from "react-router-dom"
import { routes } from "../routes/routes"

export default function Header() {
    const { user, logout } = useAuth()
    const iconSize: number = 18

    return (
        <header className="w-full bg-primary text-white">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-10">
                    <span className="text-lg font-semibold">
                        Access Control - {user ? prettyRole(user.role) : "Login"}
                    </span>
                </div>
                {user && (
                    <div className="flex items-center gap-10">
                        <Link className="flex items-center gap-2 rounded p-3 hover:bg-white/20 text-sm font-medium" to={`${routes.users.path}/${user?.id}`}>
                            <span>{user?.name} {user?.surname}</span>
                            <User size={iconSize} />
                        </Link>

                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-2 rounded p-3 hover:bg-white/20"
                        >
                            Sair
                            <LogOut size={iconSize} />
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}