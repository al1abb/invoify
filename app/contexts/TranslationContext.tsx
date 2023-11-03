import React, { createContext, useContext } from "react";

// Next Intl
import { useTranslations } from "next-intl";

const defaultTranslationContext = {
    _t: (key: string) => "",
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

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
    const _t = useTranslations();

    return (
        <TranslationContext.Provider value={{ _t }}>
            {children}
        </TranslationContext.Provider>
    );
};
