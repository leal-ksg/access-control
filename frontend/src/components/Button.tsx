import { Link } from "react-router-dom";

interface ButtonProps {
  to: string;
  texto: string;
}

export default function Button({ to: destination, texto }: ButtonProps) {
  return (
    <Link
      to={destination}
      className="rounded-4xl bg-[var(--color-primary)] text-white px-10 py-3 text-sm font-medium transition hover:bg-[var(--color-tertiary)]"
    >
      {texto}
    </Link>
  );
}   