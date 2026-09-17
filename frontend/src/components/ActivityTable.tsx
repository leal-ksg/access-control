export interface ActivityRow {
  id: string;
  userName: string;
  day: string;
  unlockTime: string;
  lockTime: string;
}

interface ActivityTableProps {
  rows: ActivityRow[];
}

const COLUMNS = ["Nome usuário", "Dia", "Horário  de desbloqueio", "Horário  de bloqueio"];

export function ActivityTable({ rows }: ActivityTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-900 text-white">
            {COLUMNS.map((column) => (
              <th key={column} className="px-4 py-3 text-center font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              className={index % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
            >
              <td className="px-4 py-3 text-center text-slate-700">{row.userName}</td>
              <td className="px-4 py-3 text-center text-slate-700">{row.day}</td>
              <td className="px-4 py-3 text-center text-slate-700">{row.unlockTime}</td>
              <td className="px-4 py-3 text-center text-slate-700">{row.lockTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
