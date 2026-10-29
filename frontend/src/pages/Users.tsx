import { routes } from "../routes/routes";
import Title from "../components/Title";
import { useEffect, useState } from "react";
import { User } from "../models/interfaces";
import { http } from "../api/http";
import LoadingElement from "../components/Loading";
import ErrorElement from "../components/Error";
import UserCards from "../components/Cards/UserCards";
import Button from "../components/Button";

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    async function getUsers() {
        setLoading(true);
        setError("");

        try {
            const { data } = await http.get(routes.api.users);
            setUsers(data);
        } catch (error: unknown) {
            console.error("Erro ao buscar usuários:", error);
            setError("Não foi possível carregar os usuários.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-5 text-center items-start mb-5">
                <Title texto="Usuários cadastrados" marginless />
                <Button to={routes.users.createPath} texto="Criar usuário" />
            </div>

            {loading ? (
                <LoadingElement texto="usuários" />
            ) : error ? (
                <ErrorElement error={error} />
            ) : users?.length === 0 ? (
                <p>Nenhum usuário cadastrado.</p>
            ) : (
                <UserCards users={users} />
            )}
        </>
    );
}