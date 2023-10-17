import "./globals.css";
import type { Metadata } from "next";

// Font
import { Outfit } from "next/font/google";

// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";

// Shadcn
import { Toaster } from "@/components/ui/toaster";

// Components
import { BaseNavbar, BaseFooter } from "@/app/components";

// Context
import Providers from "./contexts/Providers";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Invoify",
    description: "Invoice generating application",
    icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={outfit.className}>
                <Providers>
                    <BaseNavbar />
                    {children}
                    <BaseFooter />

                    {/* Toast component */}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
