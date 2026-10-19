import { Link } from "react-router-dom";
import { prettyRole } from "../../models/enums";
import { User } from "../../models/interfaces";
import { routes } from "../../routes/routes";
import { ArrowUpRight } from "lucide-react";

export default function UserCards({ users }: { users: User[] }) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,350px))] gap-5">
            {users.map(user => (
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
    )
}