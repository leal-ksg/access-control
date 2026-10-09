import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  required,
  options,
  placeholder,
  id,
  value,
  ...props
}: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s/g, "-");
  const isEmpty = !value; 

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="text-sm text-slate-800">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          required={required}
          value={value}
          className={`w-full appearance-none rounded-full border border-slate-200 px-5 py-3 pr-12 text-sm outline-none transition focus:border-slate-400 ${
            isEmpty ? "text-slate-400" : "text-slate-700"
          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-700">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
}