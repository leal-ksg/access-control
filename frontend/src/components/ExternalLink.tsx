import { Link } from "react-router-dom";

export default function ExternalLink({ text, url }: { text: string, url: string }) {
    return (
        <Link to={url} className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white w-fit p-3 border rounded-lg">
            {text}
        </Link>
    )
}