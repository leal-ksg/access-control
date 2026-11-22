import { useEffect, useRef, useState } from "react";
import Title from "../../components/Title";
import { Locker } from "../../models/interfaces";
import { http } from "../../api/http";
import { routes } from "../../routes/routes";
import ErrorElement from "../../components/Error";
import LoadingElement from "../../components/Loading";
import { useAuth } from "../../auth/AuthContext";
import { getPermissionData } from "../../utils/permissions";
import Button from "../../components/Button";
import { UserRole } from "../../models/enums";
import LockerCards, { UnlockFeedback } from "../../components/Cards/LockerCards";
import { getErrorMessage } from "../../utils/notifyError";

// Tempo que o card mostra "Desbloqueado" antes de voltar ao botão normal.
// O ESP32 destrava por TEMPO_ABERTURA (2s) e tranca sozinho em seguida.
const UNLOCKED_DISPLAY_MS = 5000

export default function LockerList() {
    const [lockers, setLockers] = useState<Locker[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [unlockingId, setUnlockingId] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<Record<string, UnlockFeedback>>({})
    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
    const { user } = useAuth()

    async function getLockers(showLoading = true) {
        if (showLoading) setLoading(true)
        setError("")

        if (!user?.id) {
            return
        }

        try {
            if (user.role === UserRole.ADMIN) {
                const { data } = await http.get(routes.api.lockers)
                setLockers(data)
            } else {
                const lockers = await getPermissionData({
                    permissionUrl: `${routes.api.permissions}${routes.api.userPerms}/${user.id}`,
                    resourceUrl: `${routes.api.lockers}`,
                    resource: perm => perm.lockerId
                })
                setLockers(lockers)
            }
        } catch (error: unknown) {
            console.error("Erro ao buscar armários:", error)
            setError("Não foi possível carregar os armários.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getLockers()
        const pending = timers.current
        return () => Object.values(pending).forEach(clearTimeout)
    }, [])

    function showFeedback(lockerId: string, value: UnlockFeedback) {
        clearTimeout(timers.current[lockerId])
        setFeedback(prev => ({ ...prev, [lockerId]: value }))
        timers.current[lockerId] = setTimeout(() => {
            setFeedback(prev => {
                const { [lockerId]: _removed, ...rest } = prev
                return rest
            })
            delete timers.current[lockerId]
        }, UNLOCKED_DISPLAY_MS)
    }

    async function unlockLocker(lockerId: string) {
        setUnlockingId(lockerId)
        try {
            await http.post(routes.api.openLocker(lockerId))
            showFeedback(lockerId, { type: "success", message: "Armário desbloqueado" })
            await getLockers(false)
        } catch (error: unknown) {
            console.error(error)
            showFeedback(lockerId, {
                type: "error",
                message: getErrorMessage(error, "Não foi possível desbloquear o armário."),
            })
        } finally {
            setUnlockingId(null)
        }
    }

    if (loading) {
        return <LoadingElement texto="armários" />
    }

    if (error && lockers?.length === 0) {
        return <ErrorElement error={error} />
    }

    if (lockers?.length === 0) {
        return <p>Nenhum armário cadastrado.</p>
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 text-center items-start">
                <Title texto="Armários cadastrados" marginless />
                {user?.role === UserRole.ADMIN && (
                    <Button to={routes.lockers.createPath} texto="Criar armário" />
                )}
            </div>

            {error && <ErrorElement error={error} />}

            <LockerCards
                lockers={lockers}
                unlock={unlockLocker}
                unlockingId={unlockingId}
                feedback={feedback}
            />
        </div>
    )
}