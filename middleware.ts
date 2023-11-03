import createMiddleware from "next-intl/middleware";

// Variables
import { LOCALES, DEFAULT_LOCALE } from "@/lib/variables";

export default createMiddleware({
    // A list of all locales that are supported
    locales: LOCALES.map((locale) => locale.code),

    // If this locale is matched, pathnames work without a prefix (e.g. `/about` instead of `/en/about`)
    defaultLocale: DEFAULT_LOCALE,
});

export const config = {
    // Skip all paths that should not be internationalized. This example skips
    // certain folders and all pathnames with a dot (e.g. favicon.ico)
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
