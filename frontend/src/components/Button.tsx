import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
}

const variantStyles = {
  solid: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border border-slate-300 text-slate-900 hover:bg-slate-50",
};

export function Button({ variant = "solid", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`w-full rounded-full py-3.5 text-sm font-semibold transition ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
