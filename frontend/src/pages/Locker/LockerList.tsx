import { useEffect, useState } from "react";
import Title from "../../components/Title";
import { Locker } from "../../models/interfaces";
import { http } from "../../api/http";
import { routes } from "../../routes/routes";
import ErrorElement from "../../components/Error";
import LockerCards from "../../components/Cards/LockerCards";
import LoadingElement from "../../components/Loading";
import { useAuth } from "../../auth/AuthContext";
import { getPermissionData } from "../../utils/permissions";
import Button from "../../components/Button";
import { UserRole } from "../../models/enums";
import { toast } from "sonner";

export default function LockerList() {
    const [lockers, setLockers] = useState<Locker[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const { user } = useAuth()

    async function getLockers() {
        setLoading(true)
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
    }, [])

    async function unlockLocker(lockerId: string) {
        try {
            await http.post(routes.api.openLocker(lockerId))
            toast.success("Armário desbloqueado")
            await getLockers()
        } catch (error: unknown) {
            console.error("Erro ao desbloquear armário:", error)
            setError("Não foi possível desbloquear o armário.")
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
                <Button to={routes.lockers.createPath} texto="Criar armário" />
            </div>

            {error && <ErrorElement error={error} />}

            <LockerCards
                lockers={lockers}
                unlock={unlockLocker}
            />
        </div>
    )
}