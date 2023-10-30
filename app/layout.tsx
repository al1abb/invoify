import "./globals.css";
import type { Metadata } from "next";

// Font
import {
    Alex_Brush,
    Dancing_Script,
    Great_Vibes,
    Outfit,
    Parisienne,
} from "next/font/google";

// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";

// Shadcn
import { Toaster } from "@/components/ui/toaster";

// Components
import { BaseNavbar, BaseFooter } from "@/app/components";

// Context
import Providers from "./contexts/Providers";

// Fonts
const outfit = Outfit({ subsets: ["latin"], display: "swap" });

// Signature fonts
const dancingScript = Dancing_Script({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-dancing-script",
    preload: true,
    display: "swap",
});

const parisienne = Parisienne({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-parisienne",
    preload: true,
    display: "swap",
});

const greatVibes = Great_Vibes({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-great-vibes",
    preload: true,
    display: "swap",
});

const alexBrush = Alex_Brush({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-alex-brush",
    preload: true,
    display: "swap",
});

export const metadata: Metadata = {
    title: "Invoify | Free Invoice Generator",
    description: "Invoice generating application",
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${outfit.className} ${dancingScript.variable} ${parisienne.variable} ${greatVibes.variable} ${alexBrush.variable} antialiased`}
            >
                <Providers>
                    <BaseNavbar />

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                        }}
                    >
                        {children}
                    </div>

                    <BaseFooter />

                    {/* Toast component */}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
