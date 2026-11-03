export default function ErrorElement({ error, centered = false }: { error: string, centered?: boolean }) {
    return (
        <p className={`
            text-md
            text-[var(--red)]
            font-medium
            ${centered ? "text-center" : ""}
        `}>
            {error}
        </p>
    )
}