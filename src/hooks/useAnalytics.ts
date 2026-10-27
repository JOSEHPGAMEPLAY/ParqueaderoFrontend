import { useEffect, useState } from 'react';
import { DashboardMetrics } from '@/types/analytics';
import { getDashboardMetrics } from '@/services/analytics';

export const RANGE_OPTIONS = [
    { key: '7', label: 'Últimos 7 días' },
    { key: '30', label: 'Últimos 30 días' },
    { key: '90', label: 'Últimos 90 días' },
];

export const useAnalytics = (initialDays = 30) => {
    const [days, setDays] = useState(initialDays);
    const [reloadToken, setReloadToken] = useState(0);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);

        getDashboardMetrics(days)
            .then((data) => {
                if (!cancelled) setMetrics(data);
            })
            .catch(() => {
                if (!cancelled) {
                    setError('No fue posible cargar las métricas. Verifica tu conexión.');
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [days, reloadToken]);

    return {
        days,
        setDays,
        metrics,
        isLoading,
        error,
        reload: () => setReloadToken((current) => current + 1),
    };
};
