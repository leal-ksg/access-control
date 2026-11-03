import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
}

export default function Input({ label, required, id, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-lg">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>
            <input
                id={id}
                required={required}
                className="w-full rounded-full border-2 border-slate-300 px-5 py-3 text-lg"
                {...props}
            />
        </div>
    )
}