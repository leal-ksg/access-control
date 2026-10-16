import { Link } from "react-router-dom";
import { routes } from "../routes/routes";
import { ArrowUpRight } from "lucide-react";
import Title from "../components/Title";
import { useEffect, useState } from "react";
import { User } from "../models/interfaces";
import { http } from "../api/http";
import { prettyRole } from "../models/enums";

export default function Users() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    async function getUsers() {
        try {
            const { data } = await http.get(routes.api.users)
            setUsers(data)
        } catch (error: unknown) {
            console.error("Erro ao buscar usuários:", error)
            setError("Não foi possível carregar os usuários.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (<>
        <Title texto="Usuários cadastrados" />

        {loading && <p>Carregando usuários...</p>}

        {error && <p className="text-sm text-[var(--red)]">{error}</p>}

        {users?.length === 0 && (
            <p>Nenhum usuário cadastrado.</p>
        )}

        {users && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,350px))] gap-5">
                {users && users.map(user => (
                    <div
                        key={user.id}
                        className="rounded-2xl bg-[var(--card-color)] p-5 flex flex-col gap-2"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">
                            {user.name} {user.surname}
                        </h2>
                        <span className="text-sm">
                            {prettyRole(user.role)}
                        </span>
                        <span className={`w-full rounded-4xl p-3 text-center text-sm font-medium ${user.active
                            ? "bg-[var(--green)] text-black"
                            : "bg-[var(--red)] text-white"
                            }`}>
                            {user.active ? "Ativo" : "Inativo"}
                        </span>
                        <Link
                            to={`${routes.users.path}/${user.id}`}
                            className="relative flex w-full items-center justify-center rounded-4xl bg-[var(--color-primary)] p-3 text-sm font-medium text-white hover:bg-[var(--color-secondary)]"
                        >
                            Ver perfil
                            <ArrowUpRight className="absolute right-3" />
                        </Link>
                    </div>
                ))}
            </div>
        )}
    </>)
}