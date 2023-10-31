import "./globals.css";
import type { Metadata } from "next";

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
