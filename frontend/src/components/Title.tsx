export default function Title({ texto, marginless = false, centered = false }: { texto: string, marginless?: boolean, centered?: boolean }) {
    return (
        <h1 className={`text-2xl font-bold ${marginless ? "" : "mb-5"} ${centered ? "text-center" : ""}`}>
            {texto}
        </h1>
    )
}