import { routes } from "../routes/routes";
import Title from "../components/Title";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <section className="relative h-full">
                <Title texto="Usuários cadastrados" />
            <Button to={routes.userCreate.path} texto="Criar usuário" />

            {loading ? (
                <LoadingElement texto="usuários" />
            ) : error ? (
                <ErrorElement error={error} />
            ) : users?.length === 0 ? (
                <p>Nenhum usuário cadastrado.</p>
            ) : (
                <UserCards users={users} />
            )}
        </section>
    );
}