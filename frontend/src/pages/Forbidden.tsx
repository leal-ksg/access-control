import Title from "../components/Title"

export default function Forbidden() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-4">
            <Title texto="Acesso negado" />
            <img className="w-full max-w-md h-auto border rounded-3xl" alt="Acesso negado" src="/src/assets/forbidden.jpg" />
        </div>
    )
}