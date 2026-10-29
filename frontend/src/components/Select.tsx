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
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

export default function Select({ id, label, options, value, onChange, placeholder = "Selecione" }: SelectProps) {
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
        onChange(optionValue);
        setOpen(false);
    }

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-lg">
                {label}
            </label>

            <div ref={ref} className="relative">
                <button
                    id={id}
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between border border-slate-200 bg-white px-4 py-3 text-left text-lg ${open ? "rounded-t-3xl rounded-b-none" : "rounded-full"}`}
                >
                    <span>{selected ? selected.label : placeholder}</span>
                    <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </button>

                {open && (
                    <ul
                        className="absolute left-0 w-full overflow-hidden rounded-b-3xl border border-t-0 border-slate-200 bg-white"
                    >
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                role="option"
                                onClick={() => handleSelect(opt.value)}
                                className={`cursor-pointer px-4 py-3 text-md hover:bg-slate-100 ${opt.value === value ? "bg-slate-100 font-medium" : ""
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