import Title from "../components/Title"

export default function Forbidden() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3">
            <Title texto={"Acesso negado"} />
            <img className="h-100 border rounded-3xl" src="/src/assets/forbidden.jpg" />
        </div>
    )
}