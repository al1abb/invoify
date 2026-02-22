import React, { createContext, useContext } from "react";

// Next Intl
import { useMessages, useTranslations } from "next-intl";

// Locales
import fallbackEnMessages from "@/i18n/locales/en.json";

const defaultTranslationContext = {
    _t: (key: string) => key,
};

export const TranslationContext = createContext(defaultTranslationContext);

export const useTranslation = () => {
    return useContext(TranslationContext);
};

export const useTranslationContext = () => {
    return useContext(TranslationContext);
};

type TranslationProviderProps = {
    children: React.ReactNode;
};

const getMessageByPath = (messages: unknown, key: string): string | null => {
    if (!messages || typeof messages !== "object") return null;

    const keys = key.split(".");
    let current: unknown = messages;

    for (const segment of keys) {
        if (!current || typeof current !== "object") return null;
        const next = (current as Record<string, unknown>)[segment];
        if (typeof next === "undefined") return null;
        current = next;
    }

    return typeof current === "string" ? current : null;
};

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
    const t = useTranslations();
    const localeMessages = useMessages();

    const _t = (key: string) => {
        const localeValue = getMessageByPath(localeMessages, key);
        if (localeValue) return localeValue;

        const fallbackValue = getMessageByPath(fallbackEnMessages, key);
        if (fallbackValue) return fallbackValue;

        try {
            return t(key);
        } catch {
            return key;
        }
    };

    return (
        <TranslationContext.Provider value={{ _t }}>
            {children}
        </TranslationContext.Provider>
    );
};
