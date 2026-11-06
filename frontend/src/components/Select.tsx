import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    id: string;
    name: string;
    label: string;
    options: Option[];
    value: string;
    onChange: (name: string, value: string) => void;
    placeholder?: string;
    required?: boolean;
    compact?: boolean;
    className?: string;
}

export default function Select({ id, name, label, options, value, onChange, placeholder = "Selecione", compact = false, className = "" }: SelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((option) => option.value === value);

    // fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelect(optionValue: string) {
        onChange(name, optionValue);
        setOpen(false);
    }

    return (
        <div className={`flex flex-col ${compact ? "gap-1 sm:flex-row sm:items-center sm:gap-2" : "gap-2"}`}>
            <label htmlFor={id} className={compact ? "text-sm font-medium whitespace-nowrap" : "text-lg"}>
                {label}
            </label>

            <div ref={ref} className={`relative ${className}`}>
                <button
                    id={id}
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between border-2 border-slate-300 bg-white text-left ${compact ? "gap-2 px-4 py-2 text-sm" : "px-4 py-3 text-lg"} ${open ? "rounded-t-3xl rounded-b-none" : "rounded-full"}`}
                >
                    <span className="truncate">{selected ? selected.label : placeholder}</span>
                    <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </button>

                {open && (
                    <ul
                        className="absolute left-0 z-20 max-h-64 w-full overflow-y-auto rounded-b-3xl border-2 border-t-0 border-slate-300 bg-white"
                    >
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                role="option"
                                onClick={() => handleSelect(opt.value)}
                                className={`cursor-pointer ${compact ? "px-4 py-2 text-sm" : "px-4 py-3 text-md"} hover:bg-slate-100 ${opt.value === value ? "bg-slate-100 font-medium" : ""
                                    }`}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}