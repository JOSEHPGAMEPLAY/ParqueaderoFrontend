'use client';

import { useMemo } from 'react';

export interface ChartPoint {
    label: string;
    value: number;
    secondary?: number;
}

const DEFAULT_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6'];

function niceMax(value: number): number {
    if (value <= 0) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / magnitude;
    const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return step * magnitude;
}

function buildTicks(max: number, count = 4): number[] {
    return Array.from({ length: count + 1 }, (_, index) =>
        Math.round((max / count) * index)
    );
}

function labelStep(total: number, maxLabels = 6): number {
    return Math.max(1, Math.ceil(total / maxLabels));
}

export function AreaChart({
    data,
    color = DEFAULT_COLORS[0],
    height = 240,
    valueFormatter,
}: {
    data: ChartPoint[];
    color?: string;
    height?: number;
    valueFormatter?: (value: number) => string;
}) {
    const width = 640;
    const padding = { top: 16, right: 16, bottom: 28, left: 52 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const max = useMemo(
        () => niceMax(Math.max(...data.map((point) => point.value), 0)),
        [data]
    );
    const ticks = useMemo(() => buildTicks(max), [max]);

    if (!data.length) {
        return (
            <p className="text-sm text-default-400 py-10 text-center">
                Sin datos para el periodo seleccionado.
            </p>
        );
    }

    const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;
    const points = data.map((point, index) => ({
        x: padding.left + (data.length === 1 ? innerWidth / 2 : index * stepX),
        y: padding.top + innerHeight - (point.value / max) * innerHeight,
        ...point,
    }));

    const linePath = points
        .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
        .join(' ');
    const areaPath = `${linePath} L${points[points.length - 1].x},${
        padding.top + innerHeight
    } L${points[0].x},${padding.top + innerHeight} Z`;
    const step = labelStep(data.length);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            role="img"
            aria-label="Gráfico de evolución"
        >
            {ticks.map((tick) => {
                const y =
                    padding.top + innerHeight - (tick / max) * innerHeight;
                return (
                    <g key={tick}>
                        <line
                            x1={padding.left}
                            x2={width - padding.right}
                            y1={y}
                            y2={y}
                            stroke="currentColor"
                            className="text-default-200"
                            strokeDasharray="3 4"
                        />
                        <text
                            x={padding.left - 8}
                            y={y + 4}
                            textAnchor="end"
                            className="fill-default-400"
                            fontSize="10"
                        >
                            {valueFormatter ? valueFormatter(tick) : tick}
                        </text>
                    </g>
                );
            })}

            <path d={areaPath} fill={color} opacity={0.14} />
            <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {points.map((point, index) => (
                <g key={`${point.label}-${index}`}>
                    <circle cx={point.x} cy={point.y} r={3} fill={color}>
                        <title>{`${point.label}: ${
                            valueFormatter ? valueFormatter(point.value) : point.value
                        }`}</title>
                    </circle>
                    {index % step === 0 && (
                        <text
                            x={point.x}
                            y={height - 8}
                            textAnchor="middle"
                            className="fill-default-400"
                            fontSize="10"
                        >
                            {point.label}
                        </text>
                    )}
                </g>
            ))}
        </svg>
    );
}

export function BarsChart({
    data,
    color = DEFAULT_COLORS[0],
    height = 220,
    valueFormatter,
}: {
    data: ChartPoint[];
    color?: string;
    height?: number;
    valueFormatter?: (value: number) => string;
}) {
    const width = 640;
    const padding = { top: 16, right: 16, bottom: 28, left: 52 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const max = useMemo(
        () => niceMax(Math.max(...data.map((point) => point.value), 0)),
        [data]
    );
    const ticks = useMemo(() => buildTicks(max), [max]);

    if (!data.length) {
        return (
            <p className="text-sm text-default-400 py-10 text-center">
                Sin datos para el periodo seleccionado.
            </p>
        );
    }

    const slot = innerWidth / data.length;
    const barWidth = Math.max(2, Math.min(36, slot * 0.62));
    const step = labelStep(data.length, 8);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            role="img"
            aria-label="Gráfico de barras"
        >
            {ticks.map((tick) => {
                const y =
                    padding.top + innerHeight - (tick / max) * innerHeight;
                return (
                    <g key={tick}>
                        <line
                            x1={padding.left}
                            x2={width - padding.right}
                            y1={y}
                            y2={y}
                            stroke="currentColor"
                            className="text-default-200"
                            strokeDasharray="3 4"
                        />
                        <text
                            x={padding.left - 8}
                            y={y + 4}
                            textAnchor="end"
                            className="fill-default-400"
                            fontSize="10"
                        >
                            {valueFormatter ? valueFormatter(tick) : tick}
                        </text>
                    </g>
                );
            })}

            {data.map((point, index) => {
                const barHeight = (point.value / max) * innerHeight;
                const x = padding.left + slot * index + (slot - barWidth) / 2;
                const y = padding.top + innerHeight - barHeight;
                return (
                    <g key={`${point.label}-${index}`}>
                        <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={Math.max(barHeight, point.value > 0 ? 2 : 0)}
                            rx={Math.min(4, barWidth / 2)}
                            fill={color}
                            opacity={0.85}
                        >
                            <title>{`${point.label}: ${
                                valueFormatter
                                    ? valueFormatter(point.value)
                                    : point.value
                            }`}</title>
                        </rect>
                        {index % step === 0 && (
                            <text
                                x={x + barWidth / 2}
                                y={height - 8}
                                textAnchor="middle"
                                className="fill-default-400"
                                fontSize="10"
                            >
                                {point.label}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

export interface DonutSegment {
    label: string;
    value: number;
    color?: string;
}

export function DonutChart({
    segments,
    centerLabel,
    valueFormatter,
}: {
    segments: DonutSegment[];
    centerLabel?: string;
    valueFormatter?: (value: number) => string;
}) {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const radius = 54;
    const stroke = 18;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;

    if (total === 0) {
        return (
            <p className="text-sm text-default-400 py-10 text-center">
                Sin datos para el periodo seleccionado.
            </p>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <svg
                viewBox="0 0 140 140"
                className="size-40 shrink-0"
                role="img"
                aria-label="Gráfico circular"
            >
                <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className="text-default-100"
                    strokeWidth={stroke}
                />
                {segments.map((segment, index) => {
                    const fraction = segment.value / total;
                    const dash = fraction * circumference;
                    const circle = (
                        <circle
                            key={segment.label}
                            cx="70"
                            cy="70"
                            r={radius}
                            fill="none"
                            stroke={segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                            strokeWidth={stroke}
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                            transform="rotate(-90 70 70)"
                            strokeLinecap="butt"
                        >
                            <title>{`${segment.label}: ${segment.value}`}</title>
                        </circle>
                    );
                    offset += dash;
                    return circle;
                })}
                <text
                    x="70"
                    y="66"
                    textAnchor="middle"
                    className="fill-default-500"
                    fontSize="10"
                >
                    {centerLabel || 'Total'}
                </text>
                <text
                    x="70"
                    y="82"
                    textAnchor="middle"
                    className="fill-foreground"
                    fontSize="16"
                    fontWeight="600"
                >
                    {valueFormatter ? valueFormatter(total) : total}
                </text>
            </svg>

            <ul className="w-full space-y-2">
                {segments.map((segment, index) => (
                    <li
                        key={segment.label}
                        className="flex items-center justify-between gap-3 text-sm"
                    >
                        <span className="flex items-center gap-2 text-default-600">
                            <span
                                className="size-2.5 rounded-full"
                                style={{
                                    backgroundColor:
                                        segment.color ||
                                        DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                                }}
                            />
                            {segment.label}
                        </span>
                        <span className="font-medium">
                            {segment.value}
                            <span className="text-default-400 ml-2">
                                {total > 0
                                    ? `${Math.round((segment.value / total) * 100)}%`
                                    : '0%'}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
