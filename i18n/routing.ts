import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/variables";

export const routing = defineRouting({
    locales: LOCALES.map((l) => l.code) as unknown as readonly string[],
    defaultLocale: DEFAULT_LOCALE,
    // Keep default locale prefix behavior (v3 switched default to 'always')
    localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
