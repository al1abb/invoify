import { ReactNode } from "react";

// Types
import { InvoiceType } from "@/types";

type InvoiceLayoutProps = {
    data: InvoiceType;
    children: ReactNode;
};

export default function InvoiceLayout({ data, children }: InvoiceLayoutProps) {
    const { details } = data;

    const head = (
        <></>
    );

    // WARNING: For custom fonts, move font imports to a global location (e.g., app/layout.tsx) for best practice in Next.js App Router.

    return (
        <>
            {head}
            <section style={{ fontFamily: "Outfit, sans-serif" }}>
                <div className="flex flex-col p-4 sm:p-10 bg-white rounded-xl min-h-[60rem]">
                    {children}
                </div>
            </section>
        </>
    );
}
