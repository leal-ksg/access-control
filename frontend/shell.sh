#!/usr/bin/env bash
set -e

if [ ! -d "src/components" ]; then
  echo "Erro: rode este script a partir da raiz do projeto (onde fica a pasta src/)."
  exit 1
fi

echo "Criando src/components/FilterInput.tsx..."
cat > src/components/FilterInput.tsx << 'EOF'
import { InputHTMLAttributes } from "react";

type FilterInputProps = InputHTMLAttributes<HTMLInputElement>;

export function FilterInput({ className = "", ...props }: FilterInputProps) {
  return (
    <input
      className={`rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-slate-400 ${className}`}
      {...props}
    />
  );
}
EOF

echo "Criando src/components/ActivityTable.tsx..."
cat > src/components/ActivityTable.tsx << 'EOF'
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
EOF

echo "Criando src/pages/ActivityHistory.tsx..."
cat > src/pages/ActivityHistory.tsx << 'EOF'
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
    <div className="mx-auto mt-30 w-[80vw] rounded-3xl bg-white p-10 shadow-xl">
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
EOF

echo "Atualizando src/App.tsx com a rota /historico-atividades..."
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import CabinetList from "./pages/CabinetList";
import ActivityHistory from "./pages/ActivityHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterForm />} />
        <Route path="/lista-armarios" element={<CabinetList />} />
        <Route path="/historico-atividades" element={<ActivityHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
EOF

echo "Pronto! Arquivos criados/atualizados:"
echo "  src/components/FilterInput.tsx"
echo "  src/components/ActivityTable.tsx"
echo "  src/pages/ActivityHistory.tsx"
echo "  src/App.tsx (atualizado)"