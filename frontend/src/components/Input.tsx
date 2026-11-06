import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
}

export default function Input({ label, required, id, type, ...props }: InputProps) {
    const isPassword = type === "password"
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-lg">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>
            <div className="relative">
                <input
                    id={id}
                    required={required}
                    type={isPassword && showPassword ? "text" : type}
                    className={`w-full rounded-full border-2 border-slate-300 px-5 py-3 text-lg ${isPassword ? "pr-14" : ""}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(show => !show)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        </div>
    )
}
