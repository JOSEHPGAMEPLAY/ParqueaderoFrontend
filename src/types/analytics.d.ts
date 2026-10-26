export interface AnalyticsRange {
    days: number;
    start: string;
    end: string;
    timezone: string;
}

export interface AnalyticsSummary {
    revenue: number;
    vehicles: number;
    averageTicket: number;
    averageStayMinutes: number;
    activeVehicles: number;
    peakHour: string | null;
    growth: {
        revenue: number;
        vehicles: number;
        averageTicket: number;
    };
}

export interface DailyPoint {
    date: string;
    revenue: number;
    vehicles: number;
}

export interface HourlyPoint {
    hour: number;
    label: string;
    vehicles: number;
    revenue: number;
}

export interface TopVehicle {
    plateNumber: string;
    visits: number;
    revenue: number;
    lastExit: string | null;
}

export interface DashboardMetrics {
    range: AnalyticsRange;
    currency: string;
    generatedAt: string;
    summary: AnalyticsSummary;
    previousSummary: {
        revenue: number;
        vehicles: number;
        averageTicket: number;
        averageStayMinutes: number;
    };
    dailySeries: DailyPoint[];
    hourlyDistribution: HourlyPoint[];
    ticketSplit: {
        withTicket: number;
        withoutTicket: number;
        revenue: { withTicket: number; withoutTicket: number };
    };
    channelSplit: {
        web: number;
        movil: number;
        desconocido: number;
        revenue: { web: number; movil: number; desconocido: number };
    };
    topVehicles: TopVehicle[];
}
