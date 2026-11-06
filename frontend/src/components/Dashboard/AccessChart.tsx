import { useEffect, useRef, useState } from "react"

export interface DailyAccess {
    date: Date
    count: number
}

interface AccessChartProps {
    data: DailyAccess[]
}

const HEIGHT = 260
const MARGIN = { top: 16, right: 8, bottom: 32, left: 36 }

function niceStep(max: number, targetTicks = 4) {
    if (max <= targetTicks) return 1
    const raw = max / targetTicks
    const magnitude = 10 ** Math.floor(Math.log10(raw))
    const normalized = raw / magnitude
    const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
    return nice * magnitude
}

const shortDate = (date: Date) =>
    date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })

const longDate = (date: Date) =>
    date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })

export default function AccessChart({ data }: AccessChartProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(0)
    const [hovered, setHovered] = useState<number | null>(null)

    useEffect(() => {
        const element = containerRef.current
        if (!element) return

        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    const maxCount = Math.max(...data.map(d => d.count), 0)
    const step = niceStep(maxCount)
    const yMax = Math.max(step * Math.ceil(maxCount / step), step)
    const ticks = Array.from({ length: yMax / step + 1 }, (_, i) => i * step)

    const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 0)
    const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
    const slot = data.length > 0 ? plotWidth / data.length : 0

    const y = (value: number) => MARGIN.top + plotHeight - (value / yMax) * plotHeight

    const minLabelSpacing = 44
    const labelEvery = Math.max(1, Math.ceil(minLabelSpacing / Math.max(slot, 1)))

    const hoveredData = hovered !== null ? data[hovered] : null
    const tooltipX = hovered !== null ? MARGIN.left + slot * hovered + slot / 2 : 0
    const tooltipY = hoveredData ? y(hoveredData.count) : 0

    return (
        <div ref={containerRef} className="relative w-full" onMouseLeave={() => setHovered(null)}>
            {width > 0 && (
                <svg
                    width={width}
                    height={HEIGHT}
                    role="img"
                    aria-label="Gráfico de linha com o número de acessos por dia"
                    className="block"
                >
                    {ticks.map(tick => (
                        <g key={tick}>
                            <line
                                x1={MARGIN.left}
                                x2={width - MARGIN.right}
                                y1={y(tick)}
                                y2={y(tick)}
                                stroke={tick === 0 ? "#9ca3af" : "#e5e7eb"}
                                strokeWidth={1}
                            />
                            <text
                                x={MARGIN.left - 8}
                                y={y(tick)}
                                textAnchor="end"
                                dominantBaseline="middle"
                                className="fill-gray-500 text-[11px] tabular-nums"
                            >
                                {tick}
                            </text>
                        </g>
                    ))}

                    {hovered !== null && (
                        <line
                            x1={tooltipX}
                            x2={tooltipX}
                            y1={MARGIN.top}
                            y2={MARGIN.top + plotHeight}
                            stroke="#9ca3af"
                            strokeWidth={1}
                            strokeDasharray="4 4"
                        />
                    )}

                    {data.length > 1 && (
                        <polyline
                            points={data
                                .map((day, index) => `${MARGIN.left + slot * index + slot / 2},${y(day.count)}`)
                                .join(" ")}
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    )}

                    {data.map((day, index) => {
                        const cx = MARGIN.left + slot * index + slot / 2
                        const isHovered = hovered === index

                        return (
                            <g key={day.date.toISOString()}>
                                <circle
                                    cx={cx}
                                    cy={y(day.count)}
                                    r={isHovered ? 7 : 5}
                                    fill={isHovered ? "var(--button-hover)" : "var(--color-primary)"}
                                    stroke="white"
                                    strokeWidth={2}
                                />

                                {index % labelEvery === 0 && (
                                    <text
                                        x={MARGIN.left + slot * index + slot / 2}
                                        y={HEIGHT - MARGIN.bottom + 18}
                                        textAnchor="middle"
                                        className="fill-gray-500 text-[11px] tabular-nums"
                                    >
                                        {shortDate(day.date)}
                                    </text>
                                )}

                                <rect
                                    x={MARGIN.left + slot * index}
                                    y={MARGIN.top}
                                    width={slot}
                                    height={plotHeight}
                                    fill="transparent"
                                    onMouseEnter={() => setHovered(index)}
                                    onClick={() => setHovered(index)}
                                />
                            </g>
                        )
                    })}
                </svg>
            )}

            {hoveredData && (
                <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-gray-200"
                    style={{
                        left: Math.min(Math.max(tooltipX, 70), width - 70),
                        top: tooltipY - 8
                    }}
                >
                    <div className="text-gray-500">{longDate(hoveredData.date)}</div>
                    <div className="font-semibold text-gray-900 tabular-nums">
                        {hoveredData.count} {hoveredData.count === 1 ? "acesso" : "acessos"}
                    </div>
                </div>
            )}
        </div>
    )
}
