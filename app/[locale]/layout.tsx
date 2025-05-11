import { BaseNavbar } from "@/app/components";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/contexts/Providers";
import {
  alexBrush,
  dancingScript,
  greatVibes,
  outfit,
  parisienne,
} from "@/lib/fonts";
import { JSONLD, ROOTKEYWORDS } from "@/lib/seo";
import { BASE_URL, GOOGLE_SC_VERIFICATION, LOCALES } from "@/lib/variables";
import Favicon from "@/public/assets/favicon/favicon.ico";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Invoizer | Invoice Generator",
  description: "Create invoices effortlessly with Invoizer Try it now!",
  icons: [{ rel: "icon", url: Favicon.src }],
  keywords: ROOTKEYWORDS,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: GOOGLE_SC_VERIFICATION,
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
  let messages;
  try {
    messages = (await import(`@/i18n/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <ClerkProvider>
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
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <BaseNavbar />

              <div className="flex flex-col">{children}</div>

              {/* Toast component */}
              <Toaster />

              {/* Vercel analytics */}
              <Analytics />
            </Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
