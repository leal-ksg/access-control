import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
      <h1 className="mb-8 text-center text-2xl font-bold text-slate-900">
        {title}
      </h1>
      {children}
    </div>
  );
}
