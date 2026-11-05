import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Locker, User } from "../../models/interfaces"
import { routes } from "../../routes/routes"
import { http } from "../../api/http"
import LoadingElement from "../../components/Loading"
import ErrorElement from "../../components/Error"
import Title from "../../components/Title"
import ReturnButton from "../../components/ReturnButton"
import { CardData } from "../../components/Cards/CardData"
import { prettyDoorState } from "../../models/enums"
import { prettyDate } from "../../utils/dateFix"
import UserCards from "../../components/Cards/UserCards"
import { getPermissionData } from "../../utils/permissions"
import Button from "../../components/Button"
import { Plus, Trash, X } from "lucide-react"

export default function LockerProfile() {
    const { id } = useParams()
    const navigate=useNavigate()

    const [locker, setLocker] = useState<Locker | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [permittedUsers, setPermittedUsers] = useState<User[]>([])

    const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false)
    const [availableUsers, setAvailableUsers] = useState<User[]>([])
    const [savingPermission, setSavingPermission] = useState<boolean>(false)

    async function getLocker() {
        setLoading(true)
        setError("")

        try {
            const { data } = await http.get(`${routes.api.lockers}/${id}`)
            setLocker(data)
            await getPermittedUsers()
        } catch (error: unknown) {
            console.error("Erro ao carregar armário:", error)
            setError("Não foi possível carregar os dados do armário")
        } finally {
            setLoading(false)
        }
    }

    async function getPermittedUsers() {
        const users = await getPermissionData({
            permissionUrl: `${routes.api.permissions}${routes.api.lockerPerms}/${id}`,
            resourceUrl: `${routes.api.users}`,
            resource: perm => perm.userId
        })
        setPermittedUsers(users)
    }

    async function getAvailableUsers() {
        try {
            const { data } = await http.get(routes.api.users)

            setAvailableUsers(data.filter(
                (user: User) => !permittedUsers.some(
                    (permitted) => permitted.id === user.id
                )
            ))
        } catch (error) {
            console.error("Erro ao buscar usuários disponíveis:", error)
            setError("Não foi possível carregar os usuários disponíveis")
        }
    }

    async function allow(id: string) {
        if (!id || !locker) return;

        setSavingPermission(true)
        setError("")

        try {
            const permissions = [
                ...permittedUsers.map(user => ({
                    userId: user.id,
                    expiresAt: null
                })),
                {
                    userId: id,
                    expiresAt: null
                }
            ]

            await http.patch(`${routes.api.permissions}/${locker.id}`, permissions)

            await getPermittedUsers()
        } catch (error: unknown) {
            console.error("Erro ao adicionar permissão:", error);
            setError("Não foi possível adicionar a permissão");
        } finally {
            setSavingPermission(false);
        }
    }

    async function removePermission(id: string) {
        if (!id || !locker) return;

        setSavingPermission(true)
        setError("")

        try {
            const permissions = permittedUsers
                .filter(user => user.id !== id)
                .map(user => ({
                    userId: user.id,
                    expiresAt: null
                }))

            await http.patch(`${routes.api.permissions}/${locker.id}`, permissions)

            await getPermittedUsers()
        } catch (error: unknown) {
            console.error("Erro ao remover permissão:", error)
            setError("Não foi possível remover a permissão")
        } finally {
            setSavingPermission(false)
        }
    }

    async function deleteLocker() {
        if (!locker) return;

        setError("")

        try {
            await http.delete(`${routes.api.lockers}/${locker.id}`)
            alert("Armário deletado")
            navigate(routes.lockers.path)
        } catch (error: unknown) {
            console.error("Erro ao deletar armário:", error)
            setError("Não foi possível deletar o armário")
        }
    }

    useEffect(() => {
        getLocker()
    }, [id])

    useEffect(() => {
        getAvailableUsers()
    }, [permittedUsers])

    if (loading) {
        return <LoadingElement texto="página do armário" />
    }

    if (error && !locker) {
        return <ErrorElement error={error} />
    }

    if (!locker) {
        return <p>Armário não encontrado.</p>
    }

    return (<>
        <Title texto={locker.name} />

        <div className="flex gap-5 text-center mb-5">
            <Button to={`${routes.lockers.editPath}/${locker.id}`} texto="Editar armário" />
            <button
                onClick={() => deleteLocker()}
                className="flex items-center justify-center gap-2 rounded-4xl bg-[var(--red)] px-10 text-sm font-medium text-white hover:opacity-80"
            >
                <Trash size={18} />
                Deletar armário
            </button>
            <ReturnButton />
        </div>

        {error&&(<ErrorElement error={error}/>)}

        <div className="flex flex-col gap-2 ml-10 my-10">
            <CardData data={locker.location} name="Local" />
            <CardData data={prettyDoorState(locker.doorState)} name="Status" />
            <CardData data={prettyDate(locker.createdAt)} name="Criação" />
        </div>

        <div className="flex flex-col gap-5">
            <div className="flex flex-row gap-5 items-center">
                <Title texto="Lista de usuários permitidos" marginless />
                {availableUsers.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowPermissionModal(true)}
                        className="rounded-4xl bg-[var(--color-primary)] px-10 py-3 text-white text-sm"
                    >
                        Adicionar permissão
                    </button>
                )}
            </div>

            {permittedUsers.length > 0
                ? <UserCards users={permittedUsers} onRemove={removePermission} />
                : <p className="text-[var(--red)] font-bold text-md">Nenhum usuário liberado.</p>
            }

            {showPermissionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
                    <div className="flex flex-col w-full max-w-lg rounded-4xl bg-white p-5 gap-5 shadow-4xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                Adicionar permissão
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowPermissionModal(false)}
                                className="hover:cursor-pointer"
                            >
                                <X size={30} className="transition-transform duration-300 hover:rotate-90 hover:text-[var(--red)]" />
                            </button>
                        </div>

                        <p className="text-gray-500">Selecione um usuário para liberar acesso ao armário</p>

                        <div className="flex flex-col gap-5">
                            {availableUsers.length > 0
                                ? (
                                    availableUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between gap-5 bg-slate-100 p-5 rounded-4xl hover:bg-slate-200 transition"
                                        >
                                            <div className="flex flex-col">
                                                <span>
                                                    {user.name} {user.surname}
                                                </span>
                                                <span>
                                                    {user.email}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => allow(user.id)}
                                                disabled={savingPermission}
                                                className="flex flex-row items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white hover:bg-[var(--color-tertiary)] disabled:opacity-50"
                                            >
                                                <Plus size={18} />
                                                {savingPermission ? "Salvando" : "Permitir"}
                                            </button>
                                        </div>
                                    ))
                                )
                                : (
                                    <p className="text-center text-slate-600 py-8">Todos os usuários estão liberados</p>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>)
}