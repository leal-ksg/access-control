import { Link } from "react-router-dom";
import { Locker } from "../../models/interfaces";
import { routes } from "../../routes/routes";
import { ArrowUpRight, Circle, LockOpen, TriangleAlert } from "lucide-react";

export interface UnlockFeedback {
    type: "success" | "error"
    message: string
}

interface LockerCardProps {
    lockers: Locker[],
    unlock?: (lockerId: string) => void
    unlockingId?: string | null
    feedback?: Record<string, UnlockFeedback>
}

export default function LockerCards({ lockers, unlock, unlockingId = null, feedback = {} }: LockerCardProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(250px,350px))] gap-4 sm:gap-5">
            {lockers.map(locker => (
                <div
                    key={locker.id}
                    className="rounded-2xl bg-[var(--card-color)] p-5 flex flex-col gap-2"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg break-words min-w-0">
                            {locker.name}
                        </h2>
                        <Circle className="stroke-0 shrink-0" fill={locker.device?.isOnline ? "var(--online)" : "var(--offline)"} />
                    </div>

                    <span className="text-sm">
                        Local: {locker.location}
                    </span>

                    {unlock && locker.device?.isOnline && (
                        feedback[locker.id]?.type === "success" ? (
                            <div
                                role="status"
                                className="flex items-center justify-center gap-2 rounded-4xl font-medium bg-[var(--green)] text-black py-4"
                            >
                                <LockOpen className="size-5" />
                                Desbloqueado
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="border rounded-4xl font-medium bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white py-4 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => unlock(locker.id)}
                                disabled={unlockingId !== null}
                            >
                                {unlockingId === locker.id ? "Desbloqueando..." : "Desbloquear"}
                            </button>
                        )
                    )}

                    {feedback[locker.id]?.type === "error" && (
                        <p role="alert" className="flex items-center gap-2 text-sm font-medium text-[var(--red)]">
                            <TriangleAlert className="size-4 shrink-0" />
                            {feedback[locker.id].message}
                        </p>
                    )}

                    <Link
                        to={`${routes.lockers.path}/${locker.id}`}
                        className="relative flex w-full items-center justify-center rounded-4xl bg-[var(--color-primary)] p-3 text-sm font-medium text-white hover:bg-[var(--color-secondary)]"
                    >
                        Ver detalhes
                        <ArrowUpRight className="absolute right-3" />
                    </Link>
                </div>
            ))}

        </div>

    )
}