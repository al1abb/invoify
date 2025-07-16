import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";

// Vercel Analytics
import { Analytics } from "@vercel/analytics/react";

// Next Intl
import { NextIntlClientProvider } from "next-intl";

// ShadCn
import { Toaster } from "@/components/ui/sonner";

// Components
import { BaseNavbar, BaseFooter } from "@/app/components";

// Contexts
import Providers from "@/contexts/Providers";

// SEO
import { ROOTKEYWORDS } from "@/lib/seo";

// Variables
import { BASE_URL, GOOGLE_SC_VERIFICATION, LOCALES } from "@/lib/variables";

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

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale: locale.code }));
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { children, params } = props;
  const { locale } = await params;
  let messages;
  try {
    messages = (await import(`@/i18n/locales/${locale}.json`)).default;
  } catch {
    notFound();
  }

  // Head logic should be moved to Next.js metadata API or a <Head> component if needed
  // <head> content removed for next-themes compatibility

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <BaseNavbar />

        <div className="flex flex-col">{children}</div>

        <BaseFooter />

        {/* Toast component */}
        <Toaster />

        {/* Vercel analytics */}
        <Analytics />
      </Providers>
    </NextIntlClientProvider>
  );
}
