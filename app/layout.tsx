import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";

// Components
import BaseNavbar from "./components/navigation/BaseNavbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Invoify",
    description: "Invoice generating application",
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
            </body>
        </html>
    );
}
