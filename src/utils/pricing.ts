import { AppConfig } from "@/types/appConfig";

interface PriceInput {
    entryTime: Date | number;
    exitTime: Date | number;
    hasTicket?: boolean;
    isFree?: boolean;
    config: AppConfig;
}

function toMillis(value: Date | number): number {
    return value instanceof Date ? value.getTime() : Number(value);
}

/**
 * Réplica de la regla del backend para mostrar una vista previa en el panel.
 * Cobra horas completas + fracción solo cuando el residuo supera el umbral.
 */
export function calculatePrice({
    entryTime,
    exitTime,
    hasTicket = true,
    isFree = false,
    config,
}: PriceInput): number {
    if (isFree) return 0;

    const entryMs = toMillis(entryTime);
    const exitMs = toMillis(exitTime);
    if (!Number.isFinite(entryMs) || !Number.isFinite(exitMs) || exitMs <= entryMs) {
        return 0;
    }

    const rate = hasTicket ? config.rates.withTicket : config.rates.withoutTicket;
    const hourlyRate = Number(rate.hour) || 0;
    const fractionRate = Number(rate.fraction) || 0;
    if (hourlyRate <= 0 && fractionRate <= 0) return 0;

    const freeMinutes = Math.max(0, Number(config.billing.freeMinutes) || 0);
    const billableMinutes = (exitMs - entryMs) / 60000 - freeMinutes;
    if (billableMinutes <= 0) return 0;

    const minimumHours = Math.max(0, Number(config.billing.minimumHours) || 0);
    const threshold = Math.max(
        0,
        Number(config.billing.fractionThresholdMinutes) || 0
    );

    const fullHours = Math.floor(billableMinutes / 60);
    const remainderMinutes = billableMinutes % 60;

    if (fullHours < minimumHours) {
        return minimumHours * hourlyRate;
    }

    const fractionCharge = remainderMinutes > threshold ? fractionRate : 0;
    return fullHours * hourlyRate + fractionCharge;
}

export function formatCurrency(
    value: number,
    currency = 'COP',
    locale = 'es-CO'
): string {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(Number(value) || 0);
    } catch {
        return `$${Math.round(Number(value) || 0).toLocaleString('es-CO')}`;
    }
}

export function formatDuration(minutes: number): string {
    const total = Math.max(0, Math.round(Number(minutes) || 0));
    const hours = Math.floor(total / 60);
    const rest = total % 60;
    if (hours === 0) return `${rest} min`;
    if (rest === 0) return `${hours} h`;
    return `${hours} h ${rest} min`;
}
