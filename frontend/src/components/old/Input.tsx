import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export function Input({ label, required, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm text-slate-800">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        required={required}
        className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-slate-400"
        {...props}
      />
    </div>
  );
}
