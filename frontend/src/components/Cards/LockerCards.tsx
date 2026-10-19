import { Link } from "react-router-dom";
import { DoorState, prettyDoorState } from "../../models/enums";
import { Locker } from "../../models/interfaces";
import { routes } from "../../routes/routes";
import { ArrowUpRight } from "lucide-react";

interface LockerCardProps {
    lockers: Locker[],
    unlock?: (lockerId: string) => void
}

export default function LockerCards({ lockers, unlock }: LockerCardProps) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,350px))] gap-5">
            {lockers.map(locker => (
                <div className="rounded-2xl bg-[var(--card-color)] p-5 flex flex-col gap-2">
                    <h2 className="font-bold text-lg">
                        {locker.name}
                    </h2>
                    <span className="text-sm">
                        Local: {locker.location}
                    </span>
                    <div className="flex flex-row gap-1 items-center text-sm">
                        <span>
                            Status:
                        </span>
                        <span className={`w-fit px-3 py-1 rounded-4xl text-center font-medium ${locker.doorState === DoorState.OPEN
                            ? "bg-[var(--green)] text-black"
                            : "bg-[var(--red)] text-white"
                            }`}>
                            {prettyDoorState(locker.doorState)}
                        </span>
                    </div>

                    {unlock && (
                        <button
                            className="border rounded-4xl font-medium bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white py-4"
                            onClick={() => unlock(locker.id)}
                        >
                            {/* PRECISA TESTAR O FUNCIONAMENTO REAL DO BOTÃO */}
                            Desbloquear
                        </button>
                    )}

                    <Link
                        to={`${routes.lockers.path}/${locker.id}`}
                        className="relative flex w-ful items-center justify-center rounded-4xl bg-[var(--color-primary)] p-3 text-sm font medium text-white hover:bg-[var(--color-secondary)]"
                    >
                        Ver detalhes
                        <ArrowUpRight className="absolute right-3" />
                    </Link>
                </div>
            ))}

        </div>

    )
}