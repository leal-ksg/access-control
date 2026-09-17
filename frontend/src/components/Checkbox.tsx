import { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, id, ...props }: CheckboxProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="flex items-center gap-2">
      <input
        id={inputId}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 accent-slate-900"
        {...props}
      />
      <label htmlFor={inputId} className="text-sm text-slate-800">
        {label}
      </label>
    </div>
  );
}
