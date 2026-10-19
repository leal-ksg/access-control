export default function ErrorElement({ error }: { error: string }) {
    return (
        <p className="text-sm text-[var(--red)]">{error}</p>
    )
}