'use client';

import { useMemo, useState } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Input,
    Select,
    SelectItem,
    Spinner,
    Switch,
} from '@heroui/react';
import {
    ArrowPathIcon,
    BanknotesIcon,
    CalculatorIcon,
    ClockIcon,
    DevicePhoneMobileIcon,
    GlobeAltIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { useAppConfig } from '@/hooks/useAppConfig';
import { calculatePrice, formatCurrency, formatDuration } from '@/utils/pricing';

const TIMEZONES = [
    'America/Bogota',
    'America/Mexico_City',
    'America/Lima',
    'America/Guayaquil',
    'America/Panama',
    'America/Caracas',
    'America/Santiago',
    'America/Argentina/Buenos_Aires',
    'America/Santo_Domingo',
    'America/Puerto_Rico',
    'Europe/Madrid',
    'UTC',
];

const CURRENCIES = ['COP', 'USD', 'MXN', 'PEN', 'CLP', 'ARS', 'EUR'];

function toNumber(value: string): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

export default function ConfiguracionPage() {
    const { user, loading } = useAuth();
    const {
        config,
        form,
        isLoading,
        isSaving,
        isDirty,
        error,
        updateForm,
        reset,
        save,
    } = useAppConfig();

    const [previewEntry, setPreviewEntry] = useState('2026-01-01T08:00');
    const [previewExit, setPreviewExit] = useState('2026-01-01T10:15');
    const [previewTicket, setPreviewTicket] = useState(true);

    const preview = useMemo(() => {
        if (!form) return null;
        const entry = new Date(previewEntry);
        const exit = new Date(previewExit);
        if (Number.isNaN(entry.getTime()) || Number.isNaN(exit.getTime())) {
            return null;
        }
        const minutes = Math.max(0, (exit.getTime() - entry.getTime()) / 60000);
        const rate = previewTicket ? form.rates.withTicket : form.rates.withoutTicket;
        return {
            minutes,
            price: calculatePrice({
                entryTime: entry,
                exitTime: exit,
                hasTicket: previewTicket,
                config: form,
            }),
            fullHours: Math.floor(minutes / 60),
            remainder: Math.round(minutes % 60),
            rate,
        };
    }, [form, previewEntry, previewExit, previewTicket]);

    if (loading || isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner label="Cargando configuración..." />
            </div>
        );
    }

    if (user?.role !== 'admin' && user?.role !== 'owner') {
        return (
            <div className="m-4 rounded-2xl border border-warning-200 bg-warning-50 p-6 text-warning-700">
                Solo administradores y propietarios pueden modificar la configuración del
                parqueadero.
            </div>
        );
    }

    if (error || !form || !config) {
        return (
            <div className="m-4 rounded-2xl border border-danger-200 bg-danger-50 p-6 text-danger-700">
                {error || 'No fue posible cargar la configuración.'}
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 space-y-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Configuración del parqueadero</h1>
                    <p className="text-sm text-default-500 mt-1">
                        Estos valores se aplican al aplicativo web y a todas las versiones
                        móviles en su próxima sincronización.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Chip color="primary" variant="flat">
                        Versión {config.version}
                    </Chip>
                    {config.updatedAt && (
                        <Chip variant="flat" color="default">
                            Actualizado{' '}
                            {new Date(config.updatedAt).toLocaleString('es-CO')}
                        </Chip>
                    )}
                </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex items-center gap-3">
                        <BanknotesIcon className="size-6 text-primary" />
                        <div>
                            <p className="font-semibold">Tarifas por hora</p>
                            <p className="text-xs text-default-500">
                                Valor de la hora completa y de la fracción adicional.
                            </p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="gap-5">
                        <div>
                            <p className="text-sm font-medium mb-2">Con tiquete</p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input
                                    type="number"
                                    min={0}
                                    label="Hora"
                                    variant="bordered"
                                    startContent={<span className="text-default-400">$</span>}
                                    value={String(form.rates.withTicket.hour)}
                                    onValueChange={(value) =>
                                        updateForm((draft) => {
                                            draft.rates.withTicket.hour = toNumber(value);
                                        })
                                    }
                                />
                                <Input
                                    type="number"
                                    min={0}
                                    label="Fracción"
                                    variant="bordered"
                                    startContent={<span className="text-default-400">$</span>}
                                    value={String(form.rates.withTicket.fraction)}
                                    onValueChange={(value) =>
                                        updateForm((draft) => {
                                            draft.rates.withTicket.fraction = toNumber(value);
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Sin tiquete</p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input
                                    type="number"
                                    min={0}
                                    label="Hora"
                                    variant="bordered"
                                    startContent={<span className="text-default-400">$</span>}
                                    value={String(form.rates.withoutTicket.hour)}
                                    onValueChange={(value) =>
                                        updateForm((draft) => {
                                            draft.rates.withoutTicket.hour = toNumber(value);
                                        })
                                    }
                                />
                                <Input
                                    type="number"
                                    min={0}
                                    label="Fracción"
                                    variant="bordered"
                                    startContent={<span className="text-default-400">$</span>}
                                    value={String(form.rates.withoutTicket.fraction)}
                                    onValueChange={(value) =>
                                        updateForm((draft) => {
                                            draft.rates.withoutTicket.fraction = toNumber(value);
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-3">
                        <ClockIcon className="size-6 text-primary" />
                        <div>
                            <p className="font-semibold">Regla de cobro</p>
                            <p className="text-xs text-default-500">
                                Define cuándo se cobra la fracción adicional.
                            </p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="gap-4">
                        <Input
                            type="number"
                            min={0}
                            max={24}
                            label="Horas mínimas"
                            variant="bordered"
                            description="Tiempo mínimo facturado aunque el vehículo permanezca menos."
                            value={String(form.billing.minimumHours)}
                            onValueChange={(value) =>
                                updateForm((draft) => {
                                    draft.billing.minimumHours = toNumber(value);
                                })
                            }
                        />
                        <Input
                            type="number"
                            min={0}
                            max={59}
                            label="Umbral de fracción (minutos)"
                            variant="bordered"
                            description={`Con 2 h ${form.billing.fractionThresholdMinutes} min se cobran 2 horas; al superar los ${form.billing.fractionThresholdMinutes} min se cobra la fracción.`}
                            value={String(form.billing.fractionThresholdMinutes)}
                            onValueChange={(value) =>
                                updateForm((draft) => {
                                    draft.billing.fractionThresholdMinutes = toNumber(value);
                                })
                            }
                        />
                        <Input
                            type="number"
                            min={0}
                            max={1440}
                            label="Minutos de cortesía"
                            variant="bordered"
                            description="Se descuentan del tiempo total antes de facturar."
                            value={String(form.billing.freeMinutes)}
                            onValueChange={(value) =>
                                updateForm((draft) => {
                                    draft.billing.freeMinutes = toNumber(value);
                                })
                            }
                        />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-3">
                        <GlobeAltIcon className="size-6 text-primary" />
                        <div>
                            <p className="font-semibold">Región y moneda</p>
                            <p className="text-xs text-default-500">
                                Zona horaria usada para cerrar los registros diarios.
                            </p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="gap-4">
                        <Select
                            label="Zona horaria"
                            variant="bordered"
                            selectedKeys={[form.timezone]}
                            onChange={(event) =>
                                updateForm((draft) => {
                                    draft.timezone = event.target.value;
                                })
                            }
                        >
                            {TIMEZONES.map((zone) => (
                                <SelectItem key={zone}>{zone}</SelectItem>
                            ))}
                        </Select>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Select
                                label="Moneda"
                                variant="bordered"
                                selectedKeys={[form.currency]}
                                onChange={(event) =>
                                    updateForm((draft) => {
                                        draft.currency = event.target.value;
                                    })
                                }
                            >
                                {CURRENCIES.map((currency) => (
                                    <SelectItem key={currency}>{currency}</SelectItem>
                                ))}
                            </Select>
                            <Input
                                label="Locale"
                                variant="bordered"
                                value={form.locale}
                                onValueChange={(value) =>
                                    updateForm((draft) => {
                                        draft.locale = value;
                                    })
                                }
                            />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-3">
                        <DevicePhoneMobileIcon className="size-6 text-primary" />
                        <div>
                            <p className="font-semibold">Aplicativo móvil</p>
                            <p className="text-xs text-default-500">
                                Controla el modo colaborativo entre celulares.
                            </p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="gap-5">
                        <Switch
                            isSelected={form.mobile.collaborativeSyncEnabled}
                            onValueChange={(value) =>
                                updateForm((draft) => {
                                    draft.mobile.collaborativeSyncEnabled = value;
                                })
                            }
                        >
                            Permitir modo colaborativo
                        </Switch>
                        <p className="text-xs text-default-500 -mt-3">
                            Si se desactiva, los celulares no podrán compartir registros entre
                            sí; seguirán trabajando offline.
                        </p>
                        <Input
                            type="number"
                            min={10}
                            max={600}
                            label="Intervalo de sincronización (segundos)"
                            variant="bordered"
                            value={String(form.mobile.syncIntervalSeconds)}
                            onValueChange={(value) =>
                                updateForm((draft) => {
                                    draft.mobile.syncIntervalSeconds = toNumber(value);
                                })
                            }
                        />
                    </CardBody>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex items-center gap-3">
                    <CalculatorIcon className="size-6 text-primary" />
                    <div>
                        <p className="font-semibold">Vista previa del cobro</p>
                        <p className="text-xs text-default-500">
                            Prueba la regla antes de guardar. No genera ningún registro.
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="gap-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Input
                            type="datetime-local"
                            label="Entrada"
                            variant="bordered"
                            value={previewEntry}
                            onValueChange={setPreviewEntry}
                        />
                        <Input
                            type="datetime-local"
                            label="Salida"
                            variant="bordered"
                            value={previewExit}
                            onValueChange={setPreviewExit}
                        />
                        <div className="flex items-end">
                            <Switch isSelected={previewTicket} onValueChange={setPreviewTicket}>
                                Con tiquete
                            </Switch>
                        </div>
                        <div className="flex items-end">
                            <div className="rounded-xl bg-primary-50 px-4 py-2 w-full">
                                <p className="text-xs text-primary-600">Total a cobrar</p>
                                <p className="text-xl font-bold text-primary-700">
                                    {preview
                                        ? formatCurrency(preview.price, form.currency, form.locale)
                                        : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                    {preview && (
                        <p className="text-sm text-default-500">
                            Permanencia: <strong>{formatDuration(preview.minutes)}</strong>. Se
                            cobran <strong>{preview.fullHours} hora(s)</strong>
                            {preview.remainder > form.billing.fractionThresholdMinutes
                                ? ` más una fracción de ${formatCurrency(
                                      preview.rate.fraction,
                                      form.currency,
                                      form.locale
                                  )} porque supera los ${
                                      form.billing.fractionThresholdMinutes
                                  } min.`
                                : ` sin fracción adicional porque los ${preview.remainder} min no superan el umbral de ${form.billing.fractionThresholdMinutes} min.`}
                        </p>
                    )}
                </CardBody>
            </Card>

            <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-default-200 bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-default-500 flex items-center gap-2">
                    {isDirty ? (
                        <>
                            <ClockIcon className="size-4 text-warning" />
                            Hay cambios sin guardar.
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon className="size-4 text-success" />
                            Todo está guardado.
                        </>
                    )}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        variant="light"
                        startContent={<ArrowPathIcon className="size-4" />}
                        isDisabled={!isDirty || isSaving}
                        onPress={reset}
                    >
                        Descartar cambios
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isSaving}
                        isDisabled={!isDirty || isSaving}
                        onPress={save}
                    >
                        Guardar configuración
                    </Button>
                </div>
            </div>
        </div>
    );
}
