import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../ui/toast";
import PlausibleProvider from "next-plausible";

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
});

export const metadata: Metadata = {
  title: "Receipt Hero - Organize Your Receipts",
  description:
    "Instantly convert invoices into clear, categorized summaries. Upload your receipts and get organized spending insights.",
  openGraph: {
    images: "https://receipthero-self.vercel.app/og.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <PlausibleProvider domain="usereceipthero.com" />
      </head>
      <body className={`${kumbhSans.variable} antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
