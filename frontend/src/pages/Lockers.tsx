import { useEffect, useState } from "react";
import Title from "../components/Title";
import { Locker } from "../models/interfaces";
import { http } from "../api/http";
import { routes } from "../routes/routes";
import ErrorElement from "../components/Error";
import LockerCards from "../components/Cards/LockerCards";
import LoadingElement from "../components/Loading";
import { useAuth } from "../auth/AuthContext";
import { getPermissionData } from "../utils/permissions";

export default function Lockers() {
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
            const lockers = await getPermissionData({
                permissionUrl: `${routes.api.permissions}${routes.api.user}/${user.id}`,
                resourceUrl: `${routes.api.lockers}`,
                resource: perm => perm.lockerId
            })
            setLockers(lockers)
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
            await getLockers()
        } catch (error: unknown) {
            console.error("Erro ao desbloquear armário:", error)
            setError("Não foi possível desbloquear o armário.")
        }
    }

    return (<>
        <Title texto="Armários cadastrados" />

        {(loading)
            ? <LoadingElement texto="armários" />
            : (error)
                ? <ErrorElement error={error} />
                : (lockers?.length === 0)
                    ? <p>Nenhum armário encontrado.</p>
                    : (<LockerCards
                        lockers={lockers}
                        unlock={unlockLocker}
                    />)
        }
    </>)
}