import { ArrowDownLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReturnButton() {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-4xl gap-2 text-sm bg-[var(--color-primary)] py-3 px-5 text-white hover:bg-[var(--color-secondary)]"
        >
            <ArrowDownLeft size={18} />
            Retornar à página anterior
        </button>
    )
}