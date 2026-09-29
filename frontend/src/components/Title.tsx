export default function Title({ texto }: { texto: string }) {
    return (
        <h1 className="mb-6 text-2xl font-bold">
            {texto}
        </h1>
    )
}