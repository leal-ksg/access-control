import { Link } from "react-router-dom";

export default function ExternalLink({ text, url }: { text: string, url: string }) {
    return (
        <Link to={url} className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white w-fit max-w-full break-words p-3 border rounded-4xl px-6 sm:px-10 text-md">
            {text}
        </Link>
    )
}