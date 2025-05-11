import { DEFAULT_LOCALE, LOCALES } from "@/lib/variables";
import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: LOCALES.map((locale) => locale.code),
  // If this locale is matched, pathnames work without a prefix (e.g. `/about` instead of `/en/about`)
  defaultLocale: DEFAULT_LOCALE,
});

export default clerkMiddleware(async (_, req) => {
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
