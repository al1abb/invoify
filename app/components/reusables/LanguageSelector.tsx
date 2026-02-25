"use client";

import { useEffect, useRef } from "react";

import { useParams } from "next/navigation";

// Next Intl
import { useRouter } from "@/i18n/navigation"; // This useRouter is wrapped with next/navigation useRouter

// ShadCn
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Variables
import { LOCALES } from "@/lib/variables";
import {
    readUserPreferences,
    updateUserPreferences,
    USER_PREFERENCES_KEY_V1,
} from "@/lib/storage/userPreferences";

const LanguageSelector = () => {
    const router = useRouter();
    const params = useParams();
    const hasAppliedPreferredLocaleRef = useRef(false);
    const localeParam = params.locale;
    const currentLocale = Array.isArray(localeParam)
        ? localeParam[0]
        : localeParam?.toString() || LOCALES[0].code;

    useEffect(() => {
        if (hasAppliedPreferredLocaleRef.current) return;
        hasAppliedPreferredLocaleRef.current = true;
        if (!window.localStorage.getItem(USER_PREFERENCES_KEY_V1)) return;

        const preferredLocale = readUserPreferences().defaultLocale;
        const isSupported = LOCALES.some(
            (locale) => locale.code === preferredLocale
        );
        if (!isSupported) return;
        if (preferredLocale === currentLocale) return;

        router.push("/", { locale: preferredLocale });
    }, [currentLocale, router]);

    const handleLanguageChange = (lang: string) => {
        updateUserPreferences({
            defaultLocale: lang,
        });
        router.push("/", { locale: lang });
    };
    return (
        <Select
            value={currentLocale}
            onValueChange={(lang) => handleLanguageChange(lang)}
        >
            <SelectTrigger
                className="w-[10rem] relative"
                aria-label="Languages"
            >
                <Badge className="position: absolute -top-4 -left-2 font-normal">
                    BETA
                </Badge>
                <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent
                style={{
                    overflowY: "hidden",
                    height: "min-content",
                }}
            >
                <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>

                    {LOCALES.map((locale) => (
                        <SelectItem key={locale.code} value={locale.code}>
                            {locale.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default LanguageSelector;
