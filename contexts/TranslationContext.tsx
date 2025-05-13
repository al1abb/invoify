"use client";

import React, { createContext, useContext } from "react";

// Types pour les traductions
type TranslationFunction = (key: string, params?: Record<string, any>) => string;

interface TranslationContextType {
    _t: TranslationFunction;
}

// Fonction par défaut qui retourne simplement la clé
const defaultTranslateFunction: TranslationFunction = (key) => key;

const defaultTranslationContext: TranslationContextType = {
    _t: defaultTranslateFunction,
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
    messages?: Record<string, any>;
};

export const TranslationProvider = ({ children, messages = {} }: TranslationProviderProps) => {
    // Crée une fonction simple de traduction qui utilise les messages fournis
    const translateFunction: TranslationFunction = (key, params = {}) => {
        // Divise la clé en segments (par exemple "form.title" -> ["form", "title"])
        const segments = key.split('.');
        
        // Parcourt les segments pour trouver la valeur dans l'objet messages
        let value = messages;
        for (const segment of segments) {
            if (!value || typeof value !== 'object') {
                return key; // Retourne la clé si le chemin n'existe pas
            }
            value = value[segment];
        }
        
        // Si aucune valeur n'est trouvée, retourne la clé
        if (!value || typeof value !== 'string') {
            return key;
        }
        
        // Remplace les paramètres dans la chaîne de caractères
        let result = value;
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                result = result.replace(`{${paramKey}}`, String(paramValue));
            });
        }
        
        return result;
    };

    return (
        <TranslationContext.Provider value={{ _t: translateFunction }}>
            {children}
        </TranslationContext.Provider>
    );
};
