export interface RateConfig {
    hour: number;
    fraction: number;
}

export interface BillingConfig {
    minimumHours: number;
    fractionThresholdMinutes: number;
    freeMinutes: number;
}

export interface MobileConfig {
    collaborativeSyncEnabled: boolean;
    syncIntervalSeconds: number;
}

export interface AppConfig {
    key: string;
    version: number;
    currency: string;
    locale: string;
    timezone: string;
    billing: BillingConfig;
    rates: {
        withTicket: RateConfig;
        withoutTicket: RateConfig;
    };
    mobile: MobileConfig;
    updatedBy?: string | null;
    updatedAt?: string | null;
    createdAt?: string | null;
}

export type AppConfigPatch = Partial<
    Omit<AppConfig, 'key' | 'version' | 'updatedBy' | 'updatedAt' | 'createdAt'>
>;
