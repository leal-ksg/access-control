export default function LoadingElement({ texto }: { texto: string }) {
    return (
        <p className="text-sm">Carregando {texto}</p>
    )
}