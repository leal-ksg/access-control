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

export default function Select({
    id,
    name,
    label,
    options,
    value,
    onChange,
    placeholder = "Selecione",
    required,
}: SelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((opt) => opt.value === value);

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
            <label htmlFor={id} className="text-sm text-slate-800">
                {label}
            </label>

            <div ref={ref} className="relative">
                {/* input escondido só para o "required" funcionar na validação do form */}
                <input
                    tabIndex={-1}
                    name={name}
                    value={value}
                    required={required}
                    onChange={() => {}}
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                    aria-hidden="true"
                />

                <button
                    id={id}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => setOpen((prev) => !prev)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between border border-slate-800 bg-white px-4 py-3 text-left text-sm ${
                        open ? "rounded-t-3xl rounded-b-none" : "rounded-full"
                    } ${selected ? "text-slate-700" : "text-slate-400"}`}
                >
                    <span>{selected ? selected.label : placeholder}</span>
                    <svg
                        className={`h-4 w-4 shrink-0 text-slate-800 ${
                            open ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 8l5 5 5-5" />
                    </svg>
                </button>

                {open && (
                    <ul
                        role="listbox"
                        className="absolute left-0 top-full z-10 w-full overflow-hidden rounded-b-3xl border border-t-0 border-slate-800 bg-white"
                    >
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                role="option"
                                aria-selected={opt.value === value}
                                onClick={() => handleSelect(opt.value)}
                                className={`cursor-pointer px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 ${
                                    opt.value === value ? "bg-slate-100 font-medium" : ""
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