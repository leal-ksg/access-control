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
import { prettyDoorState, UserRole } from "../../models/enums"
import { prettyDate } from "../../utils/dateFix"
import UserCards from "../../components/Cards/UserCards"
import { getPermissionData } from "../../utils/permissions"
import Button from "../../components/Button"
import { Plus, Trash, X } from "lucide-react"
import { toast } from "sonner"
import { confirmAction } from "../../utils/confirmAction"
import { useAuth } from "../../auth/AuthContext"
import { notifyError } from "../../utils/notifyError"

export default function LockerProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user: loggedUser } = useAuth()
    const isAdmin = loggedUser?.role === UserRole.ADMIN
    const canManagePermissions = isAdmin || loggedUser?.role === UserRole.TEACHER

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
            if (canManagePermissions) await getPermittedUsers()
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
            notifyError(error, "Não foi possível carregar os usuários disponíveis")
        }
    }

    async function allowAccess(id: string) {
        if (!id || !locker) return;

        const confirmed = await confirmAction("Deseja realmente permitir o acesso?")
        if (!confirmed) return;

        setSavingPermission(true)

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
            toast.success("Usuário liberado")
            await getPermittedUsers()
        } catch (error: unknown) {
            notifyError(error, "Não foi possível adicionar a permissão")
        } finally {
            setSavingPermission(false);
        }
    }

    async function revokeAccess(id: string) {
        if (!id || !locker) return;

        const confirmed = await confirmAction("Deseja realmente remover o acesso?")
        if (!confirmed) return;

        setSavingPermission(true)

        try {
            const permissions = permittedUsers
                .filter(user => user.id !== id)
                .map(user => ({
                    userId: user.id,
                    expiresAt: null
                }))

            await http.patch(`${routes.api.permissions}/${locker.id}`, permissions)
            toast.warning("Usuário removido")
            await getPermittedUsers()
        } catch (error: unknown) {
            notifyError(error, "Não foi possível remover a permissão")
        } finally {
            setSavingPermission(false)
        }
    }

    async function deleteLocker() {
        if (!locker) return;

        const confirmed = await confirmAction("Deseja realmente deletar o armário?")
        if (!confirmed) return;

        try {
            await http.delete(`${routes.api.lockers}/${locker.id}`)
            toast.warning("Armário deletado")
            navigate(routes.lockers.path)
        } catch (error: unknown) {
            notifyError(error, "Não foi possível deletar o armário")
        }
    }

    useEffect(() => {
        getLocker()
    }, [id])

    useEffect(() => {
        if (canManagePermissions) getAvailableUsers()
    }, [permittedUsers, canManagePermissions])

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

        <div className="flex flex-wrap gap-3 sm:gap-5 text-center mb-5">
            {isAdmin && (<>
            <Button to={`${routes.lockers.editPath}/${locker.id}`} texto="Editar armário" />
            <button
                type="button"
                onClick={() => deleteLocker()}
                className="flex items-center justify-center gap-2 rounded-4xl bg-[var(--red)] px-6 sm:px-10 py-3 text-sm font-medium text-white hover:opacity-80"
            >
                <Trash size={18} />
                Deletar armário
            </button>
            </>)}
            <ReturnButton />
        </div>

        {error && (<ErrorElement error={error} />)}

        <div className="flex flex-col gap-3 sm:gap-2 my-6 sm:ml-10 sm:my-10">
            <CardData data={locker.location} name="Local" />
            <CardData data={prettyDoorState(locker.doorState)} name="Status" />
            <CardData data={prettyDate(locker.createdAt)} name="Criação" />
            {locker.device && (
                <CardData data={locker.device.macAddress} name="Dispositivo" />
            )}
        </div>

        {canManagePermissions && (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-3 sm:gap-5 items-center">
                <Title texto="Lista de usuários permitidos" marginless />
                {availableUsers.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowPermissionModal(true)}
                        className="rounded-4xl bg-[var(--color-primary)] px-6 sm:px-10 py-3 text-white text-sm"
                    >
                        Adicionar permissão
                    </button>
                )}
            </div>

            {permittedUsers.length > 0
                ? <UserCards users={permittedUsers} onRemove={revokeAccess} />
                : <p className="text-[var(--red)] font-bold text-md">Nenhum usuário liberado.</p>
            }

            {showPermissionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
                    <div className="flex flex-col w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl sm:rounded-4xl bg-white p-5 gap-5 shadow-4xl">
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
                                            className="flex flex-col items-stretch gap-3 bg-slate-100 p-4 rounded-3xl hover:bg-slate-200 transition sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5 sm:rounded-4xl"
                                        >
                                            <div className="flex min-w-0 flex-col break-all">
                                                <span>
                                                    {user.name} {user.surname}
                                                </span>
                                                <span>
                                                    {user.email}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => allowAccess(user.id)}
                                                disabled={savingPermission}
                                                className="flex flex-row items-center justify-center gap-2 shrink-0 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white hover:bg-[var(--color-tertiary)] disabled:opacity-50"
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
        )}
    </>)
}