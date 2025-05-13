import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Fonts
import {
    alexBrush,
    dancingScript,
    greatVibes,
    outfit,
    parisienne,
} from "@/lib/fonts";

// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";

// Vercel Analytics
import { Analytics } from "@vercel/analytics/react";

// ShadCn
import { Toaster } from "@/components/ui/toaster";

// Components
import { BaseNavbar, BaseFooter } from "@/app/components";
import ProvidersWrapper from "./ProvidersWrapper";

// SEO
import { JSONLD, ROOTKEYWORDS } from "@/lib/seo";

// Variables
import { BASE_URL, GOOGLE_SC_VERIFICATION, LOCALES } from "@/lib/variables";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: "Invoify | Free Invoice Generator",
    description:
        "Create invoices effortlessly with Invoify, the free invoice generator. Try it now!",
    icons: [{ rel: "icon", url: Favicon.src }],
    keywords: ROOTKEYWORDS,
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: BASE_URL,
    },
    authors: {
        name: "Ali Abbasov",
        url: "https://aliabb.vercel.app",
    },
    verification: {
        google: GOOGLE_SC_VERIFICATION,
    },
};

export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale: locale.code }));
}

interface LayoutProps {
    children: React.ReactNode;
    params: { locale: string };
}

export default async function LocaleLayout({
    children,
    params,
}: LayoutProps) {
    // Récupération de la locale des paramètres d'URL
    const locale = params?.locale;

    // Validate that the locale is configured
    const isValidLocale = LOCALES.some(l => l.code === locale);
    if (!isValidLocale) {
        notFound();
    }

    // Load messages for the current locale
    let messages;
    try {
        messages = (await import(`@/i18n/locales/${locale}.json`)).default;
    } catch (error) {
        console.error(`Could not load messages for locale: ${locale}`, error);
        messages = {};
    }

    return (
        <html lang={locale}>
            <head>
                <script
                    type="application/ld+json"
                    id="json-ld"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
                />
            </head>
            <body
                className={`${outfit.className} ${dancingScript.variable} ${parisienne.variable} ${greatVibes.variable} ${alexBrush.variable} antialiased bg-slate-100 dark:bg-slate-800`}
            >
                <ProvidersWrapper messages={messages}>
                    <BaseNavbar />
                    <div className="flex flex-col">{children}</div>
                    <BaseFooter />
                    <Toaster />
                    <Analytics />
                </ProvidersWrapper>
            </body>
        </html>
    );
}
