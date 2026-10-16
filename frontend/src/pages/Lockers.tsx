import { useEffect, useState } from "react";
import Title from "../components/Title";
import { Locker } from "../models/interfaces";
import { http } from "../api/http";
import { routes } from "../routes/routes";
import { DoorState, prettyDoorState } from "../models/enums";

export default function Lockers() {
    const [lockers, setLockers] = useState<Locker[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    async function getLockers() {
        try {
            const { data } = await http.get<Locker[]>(routes.api.lockers)
            setLockers(data)
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
        <Title texto="Armários liberados para seu usuário" />

        {loading && <p>Carregando armários</p>}

        {error && <p className="text-sm text-[var(--red)]">{error}</p>}

        {lockers?.length === 0 && (
            <p>Nenhum armário liberado.</p>
        )}

        {lockers && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,350px))] gap-5">
                {lockers && lockers.map(locker => (
                    <div
                        key={locker.id}
                        className="rounded-2xl bg-[var(--card-color)] p-5 flex flex-col gap-2"
                    >
                        <h2 className="font-bold text-lg">
                            {locker.name}
                        </h2>
                        <span className="text-sm">
                            Local: {locker.location}
                        </span>
                        <div className="flex flex-row gap-1 items-center text-sm">
                            <span>
                                Status:
                            </span>
                            <span className={`w-fit px-3 py-1 rounded-md text-center font-medium ${locker.doorState === DoorState.OPEN
                                ? "bg-[var(--green)] text-black"
                                : "bg-[var(--red)] text-white"
                                } 
                            `}>
                                {prettyDoorState(locker.doorState)}
                            </span>
                        </div>
                        <button
                            className="border rounded-4xl font-medium bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white py-4"
                            onClick={() => unlockLocker(locker.id)}
                        >
                            {/* PRECISA TESTAR O FUNCIONAMENTO REAL DO BOTÃO */}
                            Desbloquear
                        </button>
                    </div>
                ))}
            </div >
        )
        }
    </>)
}