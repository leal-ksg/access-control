import { ArrowUpRight } from "lucide-react";
import { Button } from "./Button";

interface CabinetCardProps {
  name: string;
  location: string;
  onUnlock?: () => void;
}

export function CabinetCard({ name, location, onUnlock }: CabinetCardProps) {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-2xl bg-slate-100 p-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        <p className="text-sm text-slate-600">Local: {location}</p>
      </div>

      <Button
        variant="solid"
        fullWidth={false}
        justify="between"
        onClick={onUnlock}
        className="min-w-[180px]"
      >
        Desbloquear
        <span className="flex items-center justify-center rounded-full bg-white/10 p-1">
          <ArrowUpRight size={24}/>
        </span>
      </Button>
    </div>
  );
}