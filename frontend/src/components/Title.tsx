export default function Title({ texto, marginless = false }: { texto: string, marginless?: boolean }) {
    return (
        <h1 className={`text-2xl font-bold ${marginless ? "" : "mb-5"}`}>
            {texto}
        </h1>
    )
}