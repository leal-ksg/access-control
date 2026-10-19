import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Locker, User } from "../models/interfaces";
import { http } from "../api/http";
import { routes } from "../routes/routes";
import Title from "../components/Title";
import ErrorElement from "../components/Error";
import { CardData, CardStatus } from "../components/Cards/CardData";
import { prettyDate } from "../utils/dateFix";
import { prettyRole } from "../models/enums";
import LoadingElement from "../components/Loading";
import LockerCards from "../components/Cards/LockerCards";
import ReturnButton from "../components/ReturnButton";
import { getPermissionData } from "../utils/permissions";

export default function UserProfile() {
    const { id } = useParams()

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [lockers, setLockers] = useState<Locker[]>([])

    async function getUser() {
        setLoading(true)
        setError("")

        try {
            const { data } = await http.get(`${routes.api.users}/${id}`)
            setUser(data)
            await getLockers()
        } catch (error: unknown) {
            console.error("Erro ao carregar perfil:", error)
            setError("Não foi possível carregar os dados do usuário")
        } finally {
            setLoading(false)
        }
    }

    async function getLockers() {
        const lockers = await getPermissionData({
            permissionUrl: `${routes.api.permissions}${routes.api.user}/${id}`,
            resourceUrl: `${routes.api.lockers}`,
            resource: perm => perm.lockerId
        })
        setLockers(lockers)
    }

    useEffect(() => {
        if (!id) {
            setError("ID do usuário não informado")
            setLoading(false)
            return
        } else {
            getUser()
        }
    }, [id])

    return (<>
        {loading
            ? <LoadingElement texto="página do usuário" />
            : error
                ? <ErrorElement error={error} />
                : user && (<>
                    <ReturnButton />
                    <Title texto={`${user.name} ${user?.surname}`} />
                    <div className="flex flex-col gap-2 ml-10 my-10">
                        <CardData data={user.email} name="E-mail" />
                        <CardData data={prettyRole(user.role)} name="Cargo" />
                        <CardStatus status={user.active} />
                        <CardData data={prettyDate(user.createdAt)} name="Criação" />
                    </div>
                    <Title texto="Lista de acessos permitidos" />
                    <LockerCards
                        lockers={lockers}
                    />
                </>)
        }
    </>)
}