import { ReactNode } from "react"

interface StatCardProps {
    label: string
    value: number | string
    icon?: ReactNode
    detail?: ReactNode
}

export default function StatCard({ label, value, icon, detail }: StatCardProps) {
    return (
        <div className="flex flex-col gap-2 rounded-2xl bg-[var(--card-color)] p-5">
            <div className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700">
                <span>{label}</span>
                {icon}
            </div>
            <span className="text-3xl font-bold tabular-nums text-gray-900 sm:text-4xl">
                {value}
            </span>
            {detail && (
                <div className="text-sm text-gray-600">
                    {detail}
                </div>
            )}
        </div>
    )
}
