import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/variables";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(
    LOCALES.map((l) => l.code),
    requested,
  )
    ? requested
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
