import { useState } from "react";
import { ActivityTable, ActivityRow } from "../components/ActivityTable";
import { FilterInput } from "../components/FilterInput";
import { Button } from "../components/Button";

const MOCK_ROWS: ActivityRow[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  userName: "nome",
  day: "dd/mm/aaaa",
  unlockTime: "hh:mm",
  lockTime: "hh:mm",
}));

export default function ActivityHistory() {
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  return (
    <div className="mx-auto mt-30 w-[80vw] rounded-3xl bg-white p-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Histórico de atividades</h2>

        <div className="flex gap-3">
          <FilterInput
            placeholder="Pesquisar por nome"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <FilterInput
            placeholder="Filtrar por data"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      <ActivityTable rows={MOCK_ROWS} />

      <div className="mt-6 flex justify-center">
        <Button variant="solid" fullWidth={false} className="px-10">
          Ver mais
        </Button>
      </div>
    </div>
  );
}
