import { Link } from "react-router-dom";
import { mockUsers } from "../mocks/data";
import { routes } from "../routes/routes";
import { ArrowUpRight } from "lucide-react";
import Title from "../components/Title";

export default function Users() {
    return (<>
        <Title texto={"Usuários cadastrados"} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,350px))] gap-5">
            {mockUsers.map(user => (
                <div
                    key={user.id}
                    className="rounded-2xl bg-[var(--card-color)] p-5"
                >
                    <h2 className="text-lg font-semibold text-gray-900">
                        {user.name} {user.surname}
                    </h2>
                    <span className="mt-2 inline-block text-sm">
                        {user.role}
                    </span>
                    <div className="mt-5 flex flex-col gap-2">
                        <span className={`w-full rounded-md p-3 text-center text-sm font-medium ${user.active
                            ? "bg-[var(--green)] text-black"
                            : "bg-[var(--red)] text-white"
                            }`}>
                            {user.active ? "Ativo" : "Inativo"}
                        </span>
                        <Link
                            to={`${routes.users}/${user.id}`}
                            className="relative flex w-full items-center justify-center rounded-md bg-[#121A35] p-3 text-sm font-medium text-white hover:bg-blue-900"
                        >
                            Ver perfil
                            <ArrowUpRight className="absolute right-3" />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </>)
}