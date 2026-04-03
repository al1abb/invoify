"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SettingsType } from "@/types";
import { DEFAULT_SETTINGS, LOCAL_STORAGE_SETTINGS_KEY } from "@/lib/variables";

interface SettingsContextType {
    settings: SettingsType;
    updateSettings: (partial: Partial<SettingsType>) => void;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Deep merge with default settings to handle missing properties
                const merged: SettingsType = {
                    ...DEFAULT_SETTINGS,
                    ...parsed,
                    fieldRequirements: {
                        ...DEFAULT_SETTINGS.fieldRequirements,
                        ...parsed.fieldRequirements,
                    },
                    skuColumn: {
                        ...DEFAULT_SETTINGS.skuColumn,
                        ...parsed.skuColumn,
                    },
                    discountPerItem: {
                        ...DEFAULT_SETTINGS.discountPerItem,
                        ...parsed.discountPerItem,
                    },
                    taxPerItem: {
                        ...DEFAULT_SETTINGS.taxPerItem,
                        ...parsed.taxPerItem,
                    },
                    cashPaymentMode: {
                        ...DEFAULT_SETTINGS.cashPaymentMode,
                        ...parsed.cashPaymentMode,
                    },
                };
                setSettings(merged);
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage:", error);
            setSettings(DEFAULT_SETTINGS);
        }
        setIsLoaded(true);
    }, []);

    // Auto-persist settings to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
            } catch (error) {
                console.error("Failed to save settings to localStorage:", error);
            }
        }
    }, [settings, isLoaded]);

    const updateSettings = (partial: Partial<SettingsType>) => {
        setSettings((prev) => ({
            ...prev,
            ...partial,
        }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within SettingsProvider");
    }
    return context;
};
