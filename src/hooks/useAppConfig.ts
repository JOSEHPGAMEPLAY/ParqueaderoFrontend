import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { AppConfig, AppConfigPatch } from '@/types/appConfig';
import { getAppConfig, updateAppConfig } from '@/services/appConfig';

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

function editable(config: AppConfig): AppConfigPatch {
    return {
        currency: config.currency,
        locale: config.locale,
        timezone: config.timezone,
        billing: config.billing,
        rates: config.rates,
        mobile: config.mobile,
    };
}

export const useAppConfig = () => {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [form, setForm] = useState<AppConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAppConfig();
            setConfig(data);
            setForm(clone(data));
        } catch {
            setError('No fue posible cargar la configuración del parqueadero.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const updateForm = useCallback(
        (updater: (draft: AppConfig) => void) => {
            setForm((current) => {
                if (!current) return current;
                const draft = clone(current);
                updater(draft);
                return draft;
            });
        },
        []
    );

    const reset = useCallback(() => {
        if (config) setForm(clone(config));
    }, [config]);

    const save = useCallback(async () => {
        if (!form) return null;
        setIsSaving(true);
        try {
            const updated = await updateAppConfig(editable(form));
            setConfig(updated);
            setForm(clone(updated));
            toast.success('Configuración actualizada. Los móviles la recibirán en la próxima sincronización.');
            return updated;
        } catch {
            return null;
        } finally {
            setIsSaving(false);
        }
    }, [form]);

    const isDirty = useMemo(() => {
        if (!config || !form) return false;
        return (
            JSON.stringify(editable(config)) !== JSON.stringify(editable(form))
        );
    }, [config, form]);

    return {
        config,
        form,
        isLoading,
        isSaving,
        isDirty,
        error,
        updateForm,
        reset,
        save,
        reload: load,
    };
};
