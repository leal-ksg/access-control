import { LogOut, User } from "lucide-react"
import { useAuth } from "../auth/AuthContext"
import { prettyRole } from "../models/enums"

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
                        <div className="flex items-center gap-2 rounded p-3">
                            <span className="text-sm font-medium">
                                {user?.name} {user?.surname}
                            </span>
                            <User size={iconSize} />
                        </div>

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