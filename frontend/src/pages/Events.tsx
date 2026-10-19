import { useEffect, useState } from "react"
import Title from "../components/Title"
import { Event } from "../models/interfaces"
import { http } from "../api/http"
import { routes } from "../routes/routes"
import { prettyDate } from "../utils/dateFix"
import { prettySeverity } from "../models/enums"
import LoadingElement from "../components/Loading"
import ErrorElement from "../components/Error"

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

  const showMetadata = events.some(event => event.metadata != null)

  async function getEvents() {
    setLoading(true)
    setError("")

    try {
      const { data } = await http.get(routes.api.events)
      setEvents(data)
    } catch (error: unknown) {
      console.error("Erro ao buscar eventos:", error)
      setError("Não foi possível carregar os eventos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEvents()
  }, [])

  return (<>
    <Title texto="Histórico de eventos" />

    {(loading)
      ? <LoadingElement texto="eventos" />
      : (error)
        ? <ErrorElement error={error} />
        : events.length === 0
          ? <p>Nenhum evento encontrado.</p>
          : <>
            <div className="flex flex-wrap items-center justify-between gap-4 my-5">
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
              <div className="flex items-center gap-5">
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

            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full min-w-[700px] border-collapse">
                <thead className="bg-[var(--color-primary)] text-white">
                  <tr>
                    {[
                      "Usuário",
                      "Armário",
                      "Data/Hora",
                      "Tipo",
                      "Severidade",
                      "Mensagem",
                      "Dispositivo",
                    ].map
                      ((item, index) => (
                        <th key={index} className="p-5 text-sm font-semibold text-left">{item}</th>
                      ))}
                    {showMetadata && (
                      <th>
                        "Metadados"
                      </th>
                    )}
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
                        prettyDate(event.createdAt) ?? "-",
                        event.type ?? "-",
                        prettySeverity(event.severity) ?? "-",
                        event.message ?? "-",
                        event.deviceId ?? "-",

                      ].map((item, index) => (
                        <td key={index} className="p-5 text-sm font-medium">{item}</td>
                      ))}
                      {showMetadata && (
                        <td className="p-5 text-sm font-medium">
                          {event.metadata
                            ? (
                              <pre>
                                JSON.stringify(event.metadata, null, 2)
                              </pre>
                            )
                            : "-"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
    }
  </>)
}