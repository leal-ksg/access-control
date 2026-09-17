import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  fullWidth?: boolean;
  justify?: "center" | "between";
}

const variantStyles = {
  solid: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border border-slate-300 text-slate-900 hover:bg-slate-50",
};

const justifyStyles = {
  center: "justify-center",
  between: "justify-between",
};

export function Button({
  variant = "solid",
  fullWidth = true,
  justify = "center",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full py-3.5 px-6 text-sm font-semibold transition ${
        fullWidth ? "w-full" : ""
      } ${justifyStyles[justify]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
