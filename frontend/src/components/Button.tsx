import { Link } from "react-router-dom";

interface Button {
  to: string;
  texto: string;
}

export default function Button({ to, texto }: Button) {
  return (
    <Link
      to={to}
      className="rounded-full bg-lime-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-lime-400 absolute right-0 bottom-0"
    >
      {texto}
    </Link>
  );
}   