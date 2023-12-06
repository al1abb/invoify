import { ReactNode } from "react";

import { InvoiceType } from "@/app/types/types";

type InvoiceLayoutProps = {
    data: InvoiceType;
    children: ReactNode;
};

export default function InvoiceLayout({ data, children }: InvoiceLayoutProps) {
    const { sender, receiver, details } = data;

    // Instead of fetching all fonts, get the specific one user selected
    const fontHref = details.signature?.fontFamily
        ? `https://fonts.googleapis.com/css2?family=${details?.signature?.fontFamily}&display=swap`
        : "";

    const head = (
        <>
            {/* //! NOTE: This causes performance issues in production. (Estimated saving 1.38s) */}
            <link
                href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
                rel="stylesheet"
            />

            {details.signature?.fontFamily && (
                <>
                    <link
                        rel="preconnect"
                        href="https://fonts.googleapis.com"
                    />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin="anonymous"
                    />
                    <link href={fontHref} rel="stylesheet" />
                </>
            )}
        </>
    );

    return (
        <>
            {head}
            {children}
        </>
    );
}
