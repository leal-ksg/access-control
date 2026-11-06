import { useEffect, useMemo, useState } from "react"
import Title from "../components/Title"
import { Event, Locker } from "../models/interfaces"
import { http } from "../api/http"
import { routes } from "../routes/routes"
import { prettyDay, prettyTime } from "../utils/dateFix"
import { EVENT_TYPES, prettyEventType, prettySeverity } from "../models/enums"
import LoadingElement from "../components/Loading"
import ErrorElement from "../components/Error"
import Select from "../components/Select"

interface UserEvent {
  id: string
  name: string
  email: string
}

interface Filters {
  type: string
  userId: string
  lockerId: string
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
    lockerId: "",
  })

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    type: "",
    userId: "",
    lockerId: "",
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

  function handleFilterChange(name: string, value: string) {
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
    lockerId: "",
    }
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setCurrentPage(1)
  }

  useEffect(() => {
    getEvents()
  }, [appliedFilters])

  const [lockers, setLockers] = useState<Locker[]>([])

  useEffect(() => {
    http.get(routes.api.lockers)
      .then(({ data }) => setLockers(data))
      .catch(error => console.error("Erro ao buscar armários:", error))
  }, [])

  if (loading) {
    return <LoadingElement texto="eventos" />
  }

  if (error && events.length === 0) {
    return <ErrorElement error={error} />
  }

  return (<>
    <Title texto="Histórico de eventos" />

    {/* header */}
    <div className="flex flex-col gap-4 my-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <Select
        compact
        id="itemsPerPage"
        name="itemsPerPage"
        label="Registros por página:"
        className="sm:w-24"
        value={String(itemsPerPage)}
        options={[5, 10, 15, 20, 25, 50, 100].map(x => ({ value: String(x), label: String(x) }))}
        onChange={(_, value) => {
          setItemsPerPage(Number(value))
          setCurrentPage(1)
        }}
      />

      <form
        onSubmit={handleApplyFilters}
        className="flex flex-col gap-3 bg-[var(--card-color)] p-4 rounded-2xl border sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-5"
      >
        <Select
          compact
          id="type"
          name="type"
          label="Tipo"
          className="sm:w-60"
          value={filters.type}
          options={[
            { value: "", label: "Todos" },
            ...Object.entries(EVENT_TYPES).map(([type, label]) => ({ value: type, label })),
          ]}
          onChange={handleFilterChange}
        />
        <Select
          compact
          id="userId"
          name="userId"
          label="Usuário"
          className="sm:w-60"
          value={filters.userId}
          options={[
            { value: "", label: "Todos" },
            ...usersToFilter.map(user => ({ value: user.id, label: `${user.name} (${user.email})` })),
          ]}
          onChange={handleFilterChange}
        />
        <Select
          compact
          id="lockerId"
          name="lockerId"
          label="Armário"
          className="sm:w-60"
          value={filters.lockerId}
          options={[
            { value: "", label: "Todos" },
            ...lockers.map(locker => ({ value: locker.id, label: locker.name })),
          ]}
          onChange={handleFilterChange}
        />
        <div className="flex items-center gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
          <button
            type="submit"
            className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-full border-2 border-slate-300 bg-white px-5 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Limpar
          </button>
        </div>
      </form>

    </div>

    {/* tabela */}
    {events.length === 0
      ? (
        <p className="rounded-2xl bg-[var(--card-color)] p-5 text-center">
          Nenhum evento encontrado.
        </p>
      )
      : (
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
      )}

    {/* paginação */}
    {events.length > 0 && (
      <div className="mt-5 flex items-center justify-between gap-3 sm:justify-center sm:gap-5">
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
    )}
  </>)
}