import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Locker, User } from "../models/interfaces"
import { routes } from "../routes/routes"
import { http } from "../api/http"
import LoadingElement from "../components/Loading"
import ErrorElement from "../components/Error"
import Title from "../components/Title"
import ReturnButton from "../components/ReturnButton"
import { CardData } from "../components/Cards/CardData"
import { prettyDoorState } from "../models/enums"
import { prettyDate } from "../utils/dateFix"
import UserCards from "../components/Cards/UserCards"
import { getPermissionData } from "../utils/permissions"
import Button from "../components/Button"

export default function LockerProfile() {
    const { id } = useParams()

    const [locker, setLocker] = useState<Locker | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [users, setUsers] = useState<User[]>([])

    async function getLocker() {
        setLoading(true)
        setError("")

        try {
            const { data } = await http.get(`${routes.api.lockers}/${id}`)
            setLocker(data)
            await getUsers()
        } catch (error: unknown) {
            console.error("Erro ao carregar armário:", error)
            setError("Não foi possível carregar os dados do armário")
        } finally {
            setLoading(false)
        }
    }

    async function getUsers() {
        const users = await getPermissionData({
            permissionUrl: `${routes.api.permissions}${routes.api.locker}/${id}`,
            resourceUrl: `${routes.api.users}`,
            resource: perm => perm.userId
        })
        setUsers(users)
    }

    useEffect(() => {
        getLocker()
    }, [id])

    return (<>
        {loading
            ? <LoadingElement texto="página do armário" />
            : error
                ? <ErrorElement error={error} />
                : locker && (<>
                    <Title texto={locker.name} />
                    <div className="flex gap-5 text-center">
                        <Button to={routes.lockers.editPath} texto="Editar armário" />
                        <ReturnButton />
                    </div>
                    <div className="flex flex-col gap-2 ml-10 my-10">
                        <CardData data={locker.location} name="Local" />
                        <CardData data={prettyDoorState(locker.doorState)} name="Status" />
                        <CardData data={prettyDate(locker.createdAt)} name="Criação" />
                    </div>
                    <Title texto="Lista de usuários permitidos" />
                    <UserCards users={users} />
                </>)
        }
    </>)
}