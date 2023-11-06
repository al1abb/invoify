import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Fonts
import {
    alexBrush,
    dancingScript,
    greatVibes,
    outfit,
    parisienne,
} from "@/app/fonts/fonts";

// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";

// ShadCn
import { Toaster } from "@/components/ui/toaster";

// Components
import { BaseNavbar, BaseFooter } from "@/app/components";

// Context
import Providers from "@/app/contexts/Providers";

// Next Intl
import { NextIntlClientProvider } from "next-intl";

// Variables
import { LOCALES } from "@/lib/variables";

export const metadata: Metadata = {
    title: "Invoify | Free Invoice Generator",
    description:
        "Create professional invoices effortlessly with Invoify, the free invoice generator. Try it now!",
    icons: [{ rel: "icon", url: Favicon.src }],
    keywords: [
        "invoice",
        "invoice generating",
        "invoice generator",
        "free invoice generator",
        "invoice app",
        "invoice generator app",
    ],
    viewport: "width=device-width, initial-scale=1",
    robots: {
        index: true,
        follow: true,
    },
};

export function generateStaticParams() {
    const locales = LOCALES.map((locale) => locale.code);
    return locales;
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // ? NOTE:
    // Below code is used for server component i18n approach logic

    // Validate that the incoming `locale` parameter is valid
    // If not, return default not found page
    // const isValidLocale = locales.some((cur) => cur === locale);
    // if (!isValidLocale) notFound();

    let messages;
    try {
        messages = (await import(`@/app/i18n/locales/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body
                className={`${outfit.className} ${dancingScript.variable} ${parisienne.variable} ${greatVibes.variable} ${alexBrush.variable} antialiased`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>
                        <BaseNavbar />

                        <div className="flex flex-col">{children}</div>

                        <BaseFooter />

                        {/* Toast component */}
                        <Toaster />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
