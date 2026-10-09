import { InputHTMLAttributes } from "react";

type FilterInputProps = InputHTMLAttributes<HTMLInputElement>;

export function FilterInput({ className = "", ...props }: FilterInputProps) {
  return (
    <input
      className={`rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-slate-400 ${className}`}
      {...props}
    />
  );
}
