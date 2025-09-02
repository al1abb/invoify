import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/variables";

export const routing = defineRouting({
    locales: LOCALES.map(({ code }) => code),
    defaultLocale: DEFAULT_LOCALE,
});
