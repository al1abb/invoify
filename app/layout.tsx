import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import Favicon from "@/public/assets/favicon/favicon.ico";

// Shadcn
import { Toaster } from "@/components/ui/toaster";

// Components
import { BaseNavbar, BaseFooter } from "@/app/components";

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
                <BaseNavbar />
                {children}
                <BaseFooter />

                {/* Toast component */}
                <Toaster />
            </body>
        </html>
    );
}
