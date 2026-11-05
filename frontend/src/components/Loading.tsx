import { LoaderCircle } from "lucide-react";

export default function LoadingElement({ texto }: { texto: string }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3">
            <LoaderCircle className="h-8 w-8 animate-spin" />
            <p className="text-2xl font-medium text-gray-600">Carregando {texto}</p>
        </div>
    )
}