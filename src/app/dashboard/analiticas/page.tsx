'use client';

import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Spinner,
} from '@heroui/react';
import {
    ArrowPathIcon,
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    BanknotesIcon,
    ClockIcon,
    TicketIcon,
    TruckIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { RANGE_OPTIONS, useAnalytics } from '@/hooks/useAnalytics';
import { AreaChart, BarsChart, DonutChart } from '@/components/charts/Charts';
import { formatCurrency, formatDuration } from '@/utils/pricing';
import { DashboardMetrics } from '@/types/analytics';

function compact(value: number, currency: string): string {
    if (Math.abs(value) >= 1000) {
        return `${currency === 'COP' ? '$' : ''}${new Intl.NumberFormat('es-CO', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value)}`;
    }
    return formatCurrency(value, currency, 'es-CO');
}

function Growth({ value }: { value: number }) {
    const positive = value >= 0;
    return (
        <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
                positive ? 'text-success' : 'text-danger'
            }`}
        >
            {positive ? (
                <ArrowTrendingUpIcon className="size-3.5" />
            ) : (
                <ArrowTrendingDownIcon className="size-3.5" />
            )}
            {positive ? '+' : ''}
            {value}%
        </span>
    );
}

function SummaryCard({
    title,
    value,
    subtitle,
    icon,
    growth,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    growth?: number;
}) {
    return (
        <Card className="h-full">
            <CardBody className="gap-2">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs uppercase tracking-wide text-default-500">{title}</p>
                    <span className="text-primary">{icon}</span>
                </div>
                <p className="text-2xl font-bold leading-tight">{value}</p>
                <div className="flex items-center gap-2 min-h-4">
                    {typeof growth === 'number' && <Growth value={growth} />}
                    {subtitle && <p className="text-xs text-default-400">{subtitle}</p>}
                </div>
            </CardBody>
        </Card>
    );
}

function TopVehicles({
    vehicles,
    currency,
}: {
    vehicles: DashboardMetrics['topVehicles'];
    currency: string;
}) {
    if (!vehicles.length) {
        return (
            <p className="text-sm text-default-400 py-8 text-center">
                Aún no hay vehículos registrados en este periodo.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-default-500 border-b border-default-200">
                        <th className="py-2 pr-3 font-medium">#</th>
                        <th className="py-2 pr-3 font-medium">Placa</th>
                        <th className="py-2 pr-3 font-medium text-right">Visitas</th>
                        <th className="py-2 pr-3 font-medium text-right">Recaudado</th>
                        <th className="py-2 font-medium text-right hidden sm:table-cell">
                            Última salida
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle, index) => (
                        <tr
                            key={vehicle.plateNumber}
                            className="border-b border-default-100 last:border-0"
                        >
                            <td className="py-2 pr-3 text-default-400">{index + 1}</td>
                            <td className="py-2 pr-3 font-semibold">{vehicle.plateNumber}</td>
                            <td className="py-2 pr-3 text-right">{vehicle.visits}</td>
                            <td className="py-2 pr-3 text-right">
                                {formatCurrency(vehicle.revenue, currency, 'es-CO')}
                            </td>
                            <td className="py-2 text-right text-default-500 hidden sm:table-cell">
                                {vehicle.lastExit
                                    ? new Date(vehicle.lastExit).toLocaleDateString('es-CO')
                                    : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function AnaliticasPage() {
    const { user, loading } = useAuth();
    const { days, setDays, metrics, isLoading, error, reload } = useAnalytics(30);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner label="Cargando panel..." />
            </div>
        );
    }

    if (user?.role !== 'admin' && user?.role !== 'owner') {
        return (
            <div className="m-4 rounded-2xl border border-warning-200 bg-warning-50 p-6 text-warning-700">
                El panel analítico está disponible para administradores y propietarios.
            </div>
        );
    }

    const currency = metrics?.currency || 'COP';
    const summary = metrics?.summary;

    return (
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 space-y-6">
            <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Analíticas del parqueadero</h1>
                    <p className="text-sm text-default-500 mt-1">
                        Recaudo, ocupación y comportamiento de los vehículos.
                        {metrics?.range?.timezone && (
                            <span className="ml-1">
                                Zona horaria: {metrics.range.timezone}.
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <ButtonGroup size="sm" variant="flat">
                        {RANGE_OPTIONS.map((option) => (
                            <Button
                                key={option.key}
                                color={String(days) === option.key ? 'primary' : 'default'}
                                onPress={() => setDays(Number(option.key))}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        aria-label="Actualizar métricas"
                        onPress={reload}
                    >
                        <ArrowPathIcon className="size-4" />
                    </Button>
                </div>
            </header>

            {error && (
                <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
                    {error}
                </div>
            )}

            {isLoading || !metrics || !summary ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <Spinner label="Calculando métricas..." />
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            title="Recaudo del periodo"
                            value={formatCurrency(summary.revenue, currency, 'es-CO')}
                            growth={summary.growth.revenue}
                            subtitle="vs. periodo anterior"
                            icon={<BanknotesIcon className="size-5" />}
                        />
                        <SummaryCard
                            title="Vehículos atendidos"
                            value={String(summary.vehicles)}
                            growth={summary.growth.vehicles}
                            subtitle="vs. periodo anterior"
                            icon={<TruckIcon className="size-5" />}
                        />
                        <SummaryCard
                            title="Ticket promedio"
                            value={formatCurrency(summary.averageTicket, currency, 'es-CO')}
                            growth={summary.growth.averageTicket}
                            subtitle="vs. periodo anterior"
                            icon={<TicketIcon className="size-5" />}
                        />
                        <SummaryCard
                            title="Permanencia promedio"
                            value={formatDuration(summary.averageStayMinutes)}
                            subtitle={`${summary.activeVehicles} vehículo(s) dentro ahora`}
                            icon={<ClockIcon className="size-5" />}
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-col items-start gap-1">
                                <p className="font-semibold">Evolución del recaudo</p>
                                <p className="text-xs text-default-500">
                                    Ingresos por día según la hora de salida.
                                </p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <AreaChart
                                    data={metrics.dailySeries.map((point) => ({
                                        label: point.date.slice(5),
                                        value: point.revenue,
                                    }))}
                                    valueFormatter={(value) => compact(value, currency)}
                                />
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-col items-start gap-1">
                                <p className="font-semibold">Tipo de tiquete</p>
                                <p className="text-xs text-default-500">
                                    Distribución de vehículos facturados.
                                </p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <DonutChart
                                    centerLabel="Vehículos"
                                    segments={[
                                        {
                                            label: 'Con tiquete',
                                            value: metrics.ticketSplit.withTicket,
                                            color: '#2563eb',
                                        },
                                        {
                                            label: 'Sin tiquete',
                                            value: metrics.ticketSplit.withoutTicket,
                                            color: '#f59e0b',
                                        },
                                    ]}
                                />
                            </CardBody>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-col items-start gap-1">
                                <p className="font-semibold">Vehículos por día</p>
                                <p className="text-xs text-default-500">
                                    Cantidad de salidas registradas cada día.
                                </p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <BarsChart
                                    color="#16a34a"
                                    data={metrics.dailySeries.map((point) => ({
                                        label: point.date.slice(5),
                                        value: point.vehicles,
                                    }))}
                                />
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-col items-start gap-1">
                                <p className="font-semibold">Horas de mayor demanda</p>
                                <p className="text-xs text-default-500">
                                    Vehículos que ingresaron en cada hora del día.
                                    {summary.peakHour && ` Hora pico: ${summary.peakHour}.`}
                                </p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <BarsChart
                                    color="#8b5cf6"
                                    data={metrics.hourlyDistribution.map((point) => ({
                                        label: point.label,
                                        value: point.vehicles,
                                    }))}
                                />
                            </CardBody>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-1">
                            <CardHeader className="flex flex-col items-start gap-1">
                                <p className="font-semibold">Canal de registro</p>
                                <p className="text-xs text-default-500">
                                    Web vs. aplicativo móvil.
                                </p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <DonutChart
                                    centerLabel="Registros"
                                    segments={[
                                        {
                                            label: 'Web',
                                            value: metrics.channelSplit.web,
                                            color: '#2563eb',
                                        },
                                        {
                                            label: 'Móvil',
                                            value: metrics.channelSplit.movil,
                                            color: '#16a34a',
                                        },
                                        {
                                            label: 'Sin dato',
                                            value: metrics.channelSplit.desconocido,
                                            color: '#9ca3af',
                                        },
                                    ]}
                                />
                            </CardBody>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-col items-start gap-1">
                                <p className="font-semibold">Vehículos frecuentes</p>
                                <p className="text-xs text-default-500">
                                    Top 10 por número de visitas en el periodo.
                                </p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <TopVehicles
                                    vehicles={metrics.topVehicles}
                                    currency={currency}
                                />
                            </CardBody>
                        </Card>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-default-400">
                        <Chip size="sm" variant="flat">
                            Periodo: {metrics.range.days} días
                        </Chip>
                        <Chip size="sm" variant="flat">
                            Desde {new Date(metrics.range.start).toLocaleDateString('es-CO')}
                        </Chip>
                        <Chip size="sm" variant="flat">
                            Hasta {new Date(metrics.range.end).toLocaleDateString('es-CO')}
                        </Chip>
                        <span>
                            Calculado {new Date(metrics.generatedAt).toLocaleString('es-CO')}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
