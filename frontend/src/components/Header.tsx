import { LogOut } from "lucide-react"
import { useAuth } from "../auth/AuthContext"
import beautifyRole from "../utils/role"

export default function Header() {
    const { user, logout } = useAuth()

    return (
        <header className="w-full bg-primary text-white">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-10">
                    <span className="text-lg font-semibold">
                        Access Control
                    </span>
                    <span className="text-sm text-green-300">
                        {user && beautifyRole(user.role)}
                    </span>
                </div>

                <div className="flex items-center gap-10">
                    <span className="text-sm font-medium">
                        {user?.name} {user?.surname}
                    </span>
                    <button
                        type="button"
                        onClick={logout}
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                        Sair
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    )
}