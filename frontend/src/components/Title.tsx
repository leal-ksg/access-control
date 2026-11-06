export default function Title({ texto, marginless = false, centered = false }: { texto: string, marginless?: boolean, centered?: boolean }) {
    return (
        <h1 className={`text-xl sm:text-2xl font-bold break-words ${marginless ? "" : "mb-5"} ${centered ? "text-center" : ""}`}>
            {texto}
        </h1>
    )
}