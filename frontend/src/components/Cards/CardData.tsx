export function CardData({ data, name }: { data: string, name: string }) {
    return (
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
            <p className="text-md sm:min-w-24">{name}:</p>
            <p className="w-full sm:w-100 max-w-full break-all text-sm px-5 py-2 rounded-4xl bg-[var(--card-color)]">{data}</p>
        </div>
    )
}

export function CardStatus({ status }: { status: boolean }) {
    return (
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
            <p className="text-md sm:min-w-24">Status:</p>
            <span className={`w-full sm:w-100 max-w-full text-sm px-5 py-2 rounded-4xl ${status
                ? "bg-[var(--green)] text-black"
                : "bg-[var(--red)] text-white"
                }`}>
                {status ? "Ativo" : "Inativo"}
            </span>
        </div>

    )
}