import Title from "../components/Title";
import { routes } from "../routes/routes";
import { useAuth } from "../auth/AuthContext";
import { UserRole } from "../models/enums";
import ExternalLink from "../components/ExternalLink";
import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";
import { Event, Locker, User } from "../models/interfaces";
import StatCard from "../components/Dashboard/StatCard";
import AccessChart, { DailyAccess } from "../components/Dashboard/AccessChart";
import ErrorElement from "../components/Error";
import { Circle, LoaderCircle, Lock, Users } from "lucide-react";

const ACCESS_EVENT_TYPE = "LOCKER_UNLOCKED"
const RANGE_OPTIONS = [7, 14, 30]

function startOfDay(date: Date) {
    const copy = new Date(date)
    copy.setHours(0, 0, 0, 0)
    return copy
}

function dayKey(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export default function Dashboard() {
    const { user } = useAuth()
    const isAdmin = user?.role === UserRole.ADMIN
    const prismaURL = import.meta.env.VITE_PRISMA_STUDIO_URL
    const [prismaRunning, setPrismaRunning] = useState<boolean>(false)

    const [lockers, setLockers] = useState<Locker[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loadingStats, setLoadingStats] = useState<boolean>(true)
    const [statsError, setStatsError] = useState<string>("")

    const [rangeDays, setRangeDays] = useState<number>(7)
    const [accessEvents, setAccessEvents] = useState<Event[]>([])
    const [loadingChart, setLoadingChart] = useState<boolean>(true)
    const [chartError, setChartError] = useState<string>("")
    const [showTable, setShowTable] = useState<boolean>(false)

    useEffect(() => {
        if (!isAdmin) return
        fetch(prismaURL, {
            mode: "no-cors"
        })
            .then(() => setPrismaRunning(true))
            .catch(() => setPrismaRunning(false))
    }, [prismaURL, isAdmin])

    useEffect(() => {
        if (!isAdmin) return

        async function getStats() {
            setLoadingStats(true)
            setStatsError("")
            try {
                const [lockersResponse, usersResponse] = await Promise.all([
                    http.get(routes.api.lockers),
                    http.get(routes.api.users)
                ])
                setLockers(lockersResponse.data)
                setUsers(usersResponse.data)
            } catch (error: unknown) {
                console.error("Erro ao buscar dados da dashboard:", error)
                setStatsError("Não foi possível carregar os totais de armários e usuários.")
            } finally {
                setLoadingStats(false)
            }
        }

        getStats()
    }, [isAdmin])

    useEffect(() => {
        if (!isAdmin) return

        async function getAccessEvents() {
            setLoadingChart(true)
            setChartError("")
            try {
                const start = startOfDay(new Date())
                start.setDate(start.getDate() - (rangeDays - 1))

                const { data } = await http.get(routes.api.events, {
                    params: {
                        type: ACCESS_EVENT_TYPE,
                        startDate: start.toISOString()
                    }
                })
                setAccessEvents(data)
            } catch (error: unknown) {
                console.error("Erro ao buscar acessos:", error)
                setChartError("Não foi possível carregar o histórico de acessos.")
            } finally {
                setLoadingChart(false)
            }
        }

        getAccessEvents()
    }, [isAdmin, rangeDays])

    const onlineLockers = lockers.filter(locker => locker.device?.isOnline).length
    const offlineLockers = lockers.length - onlineLockers
    const activeUsers = users.filter(u => u.active).length

    const dailyAccess: DailyAccess[] = useMemo(() => {
        const counts = new Map<string, number>()
        accessEvents.forEach(event => {
            const key = dayKey(new Date(event.createdAt))
            counts.set(key, (counts.get(key) ?? 0) + 1)
        })

        const today = startOfDay(new Date())
        return Array.from({ length: rangeDays }, (_, i) => {
            const date = new Date(today)
            date.setDate(today.getDate() - (rangeDays - 1 - i))
            return { date, count: counts.get(dayKey(date)) ?? 0 }
        })
    }, [accessEvents, rangeDays])

    const totalAccess = dailyAccess.reduce((sum, day) => sum + day.count, 0)

    return (<>
        <Title texto="Bem-vindo ao sistema!" />

        {isAdmin && (
            <div className="flex flex-col gap-6">
                {statsError && <ErrorElement error={statsError} />}

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Armários cadastrados"
                        value={loadingStats ? "–" : lockers.length}
                        icon={<Lock size={20} />}
                    />
                    <StatCard
                        label="Armários online"
                        value={loadingStats ? "–" : onlineLockers}
                        icon={<Circle size={14} className="stroke-0" fill="var(--online)" />}
                        detail="Dispositivo conectado"
                    />
                    <StatCard
                        label="Armários offline"
                        value={loadingStats ? "–" : offlineLockers}
                        icon={<Circle size={14} className="stroke-0" fill="var(--offline)" />}
                        detail="Desconectados ou sem dispositivo"
                    />
                    <StatCard
                        label="Usuários cadastrados"
                        value={loadingStats ? "–" : users.length}
                        icon={<Users size={20} />}
                        detail={loadingStats ? undefined : `${activeUsers} ativos`}
                    />
                </section>

                <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Acessos por dia</h2>
                            <p className="text-sm text-gray-600">
                                {loadingChart
                                    ? "Carregando..."
                                    : `${totalAccess} ${totalAccess === 1 ? "acesso" : "acessos"} nos últimos ${rangeDays} dias`}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex rounded-full bg-[var(--card-color)] p-1" role="group" aria-label="Período">
                                {RANGE_OPTIONS.map(days => (
                                    <button
                                        key={days}
                                        type="button"
                                        onClick={() => setRangeDays(days)}
                                        aria-pressed={rangeDays === days}
                                        className={`rounded-full px-3 py-1 text-sm font-medium transition ${rangeDays === days
                                            ? "bg-[var(--color-primary)] text-white"
                                            : "text-gray-700 hover:bg-white"
                                            }`}
                                    >
                                        {days} dias
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTable(show => !show)}
                                className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-100"
                            >
                                {showTable ? "Ver gráfico" : "Ver tabela"}
                            </button>
                        </div>
                    </div>

                    {chartError && <ErrorElement error={chartError} />}

                    {loadingChart ? (
                        <div className="flex h-[260px] items-center justify-center">
                            <LoaderCircle className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : showTable ? (
                        <div className="max-h-[260px] overflow-y-auto rounded-xl">
                            <table className="w-full border-collapse text-sm">
                                <thead className="sticky top-0 bg-[var(--color-primary)] text-white">
                                    <tr>
                                        <th className="p-3 text-left font-semibold">Dia</th>
                                        <th className="p-3 text-right font-semibold">Acessos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dailyAccess.map((day, index) => (
                                        <tr
                                            key={day.date.toISOString()}
                                            className={index % 2 === 0 ? "bg-[var(--light-line)]" : "bg-[var(--dark-line)]"}
                                        >
                                            <td className="p-3">{day.date.toLocaleDateString("pt-BR")}</td>
                                            <td className="p-3 text-right tabular-nums">{day.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <AccessChart data={dailyAccess} />
                    )}
                </section>

                {prismaRunning && (
                    <section className="flex flex-col gap-5">
                        <ExternalLink url={prismaURL} text="Prisma Studio" />
                    </section>
                )}
            </div>
        )}

    </>)
}
