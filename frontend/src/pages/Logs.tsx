import Title from "../components/Title"
import { mockEvents } from "../mocks/data"

export default function Logs() {
  return (<>
    <Title texto={"Histórico de registros"} />
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
              "Mensagem"
            ].map
              ((item, index) => (
                <th key={index} className="p-5 text-sm font-semibold text-left">{item}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {mockEvents.map((event, index) => (
            <tr
              key={event.id}
              className={`${(index % 2 === 0)
                ? "bg-[var(--light-line)]"
                : "bg-[var(--dark-line)]"}
              `}
            >
              {[
                event.userId ?? "Sistema",
                event.lockerId ?? "-",
                new Date(event.createdAt).toLocaleString("pt-BR"),
                event.type,
                event.severity,
                event.message
              ].map((item, index) => (
                <td key={index} className="p-5 text-sm font-medium">{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  </>)
}