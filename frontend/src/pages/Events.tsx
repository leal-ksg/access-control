import { useEffect, useMemo, useState } from "react"
import Title from "../components/Title"
import { Event } from "../models/interfaces"
import { http } from "../api/http"
import { routes } from "../routes/routes"
import { prettyDay, prettyTime } from "../utils/dateFix"
import { EVENT_TYPES, prettyEventType, prettySeverity } from "../models/enums"
import LoadingElement from "../components/Loading"
import ErrorElement from "../components/Error"

interface UserEvent {
  id: string
  name: string
  email: string
}

interface Filters {
  type: string
  userId: string
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const totalPages = Math.ceil(events.length / itemsPerPage)

  const currentEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  async function getEvents() {
    setLoading(true)
    setError("")

    const params = Object.fromEntries(
      Object.entries(appliedFilters).filter(([_, value]) => value !== "")
    )

    try {
      const { data } = await http.get(routes.api.events, { params })
      setEvents(data)
    } catch (error: unknown) {
      console.error("Erro ao buscar eventos:", error)
      setError("Não foi possível carregar os eventos.")
    } finally {
      setLoading(false)
    }
  }

  const [filters, setFilters] = useState<Filters>({
    type: "",
    userId: "",
  })

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    type: "",
    userId: "",
  })

  const usersToFilter = useMemo(() => {
    const userMap = new Map<string, UserEvent>()

    events.forEach(event => {
      if (event.user && event.userId && !userMap.has(event.userId)) {
        userMap.set(event.userId, {
          id: event.userId,
          name: event.user.name,
          email: event.user.email
        })
      }
    })

    return Array.from(userMap.values())
  }, [events])

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  function handleApplyFilters(e: React.FormEvent) {
    e.preventDefault()
    setCurrentPage(1)
    setAppliedFilters(filters)
  }

  function handleClearFilters() {
    const emptyFilters: Filters = {
      type: "",
      userId: "",
    }
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setCurrentPage(1)
  }

  useEffect(() => {
    getEvents()
  }, [appliedFilters])

  if (loading) {
    return <LoadingElement texto="eventos" />
  }

  if (error && events.length === 0) {
    return <ErrorElement error={error} />
  }

  if (events.length === 0) {
    return <p>Nenhum evento encontrado.</p>
  }

  return (<>
    <Title texto="Histórico de eventos" />

    {/* header */}
    <div className="flex flex-col gap-4 my-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <label htmlFor="itemsPerPage">
          Registros por página:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
          className="rounded-lg border p-2 bg-[var(--card-color)]"
        >
          {[5, 10, 15, 20, 25, 50, 100].map(x => (
            <option
              key={x}
              value={x}
            >
              {x}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleApplyFilters}
        className="flex flex-col gap-3 bg-[var(--card-color)] p-4 rounded-2xl border sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-5"
      >
        <div className="flex flex-col gap-1 text-sm font-medium sm:flex-row sm:items-center sm:gap-2">
          <label htmlFor="type">Tipo</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full rounded-lg border p-2 text-sm bg-white text-black sm:w-auto"
          >
            <option value="">Todos</option>
            {Object.entries(EVENT_TYPES).map(([type, label]) => (
              <option key={type} value={type}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 text-sm font-medium sm:flex-row sm:items-center sm:gap-2">
          <label htmlFor="userId">Usuário</label>
          <select
            id="userId"
            name="userId"
            value={filters.userId}
            onChange={handleFilterChange}
            className="w-full rounded-lg border p-2 text-sm bg-white text-black sm:w-auto sm:max-w-[200px]"
          >
            <option value="">Todos</option>
            {usersToFilter.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-lg border border-gray-400 px-3 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Limpar
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-5">
        <button
          onClick={() => setCurrentPage((page) => page - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg bg-[var(--color-primary)] p-2 text-white disabled:opacity-40"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {Math.max(totalPages, 1)}
        </span>
        <button
          onClick={() => setCurrentPage((page) => page + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg bg-[var(--color-primary)] p-2 text-white disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>

    {/* tabela */}
    <div className="overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[700px] border-collapse">
        <thead className="bg-[var(--color-primary)] text-white">
          <tr>
            {[
              "Usuário",
              "Armário",
              "Data",
              "Hora",
              "Tipo",
              "Severidade",
              "Mensagem",
              "Dispositivo",
            ].map
              ((item, index) => (
                <th key={index} className="border-r border-white/30 last:border-r-0 p-3 sm:p-5 text-sm font-semibold text-left whitespace-nowrap">{item}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event, index) => (
            <tr
              key={event.id}
              className={`${(index % 2 === 0)
                ? "bg-[var(--light-line)]"
                : "bg-[var(--dark-line)]"}
              `}
            >
              {[
                event.user ? `${event.user.name} ${event.user.email}` : "Sistema",
                event.locker?.name ?? "-",
                prettyDay(event.createdAt),
                prettyTime(event.createdAt),
                prettyEventType(event.type),
                prettySeverity(event.severity) ?? "-",
                event.message ?? "-",
                event.deviceId ?? "-",

              ].map((item, index) => (
                <td key={index} className="border-r border-gray-300 last:border-r-0 p-3 sm:p-5 text-sm font-medium align-top">{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>)
}