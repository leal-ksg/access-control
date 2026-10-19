export function CardData({ data, name }: { data: string, name: string }) {
    return (
        <div className="flex flex-row items-center gap-2">
            <p className="text-md min-w-15">{name}:</p>
            <p className="w-100 text-sm px-5 py-2 rounded-4xl bg-[var(--card-color)]">{data}</p>
        </div>
    )
}

export function CardStatus({ status }: { status: boolean }) {
    return (
        <div className="flex flex-row items-center gap-2">
            <p className="text-md min-w-15">Status:</p>
            <span className={`w-100 text-sm px-5 py-2 rounded-4xl ${status
                ? "bg-[var(--green)] text-black"
                : "bg-[var(--red)] text-white"
                }`}>
                {status ? "Ativo" : "Inativo"}
            </span>
        </div>

    )
}