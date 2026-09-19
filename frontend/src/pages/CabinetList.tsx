import { CabinetCard } from "../components/CabinetCard";

interface Cabinet {
  id: string;
  name: string;
  location: string;
}

const CABINETS: Cabinet[] = [
  { id: "1", name: "Armário 1", location: "PIPA IFMAKERS" },
  { id: "2", name: "Armário 1", location: "PIPA IFMAKERS" },
  { id: "3", name: "Armário 1", location: "PIPA IFMAKERS" },
  { id: "4", name: "Armário 1", location: "PIPA IFMAKERS" },
  { id: "5", name: "Armário 1", location: "PIPA IFMAKERS" },
  { id: "6", name: "Armário 1", location: "PIPA IFMAKERS" },
];

export default function CabinetList() {
  function handleUnlock(id: string) {
    console.log("Desbloqueando armário", id);
  }

  return (
    <div className="mx-auto mt-30 w-[80vw] rounded-3xl bg-white p-10">
      <h2 className="mb-6 text-xl font-bold text-slate-900">Armários liberados</h2>

      <div className="grid grid-cols-3 gap-6">
        {CABINETS.map((cabinet) => (
          <CabinetCard
            key={cabinet.id}
            name={cabinet.name}
            location={cabinet.location}
            onUnlock={() => handleUnlock(cabinet.id)}
          />
        ))}
      </div>
    </div>
  );
}
