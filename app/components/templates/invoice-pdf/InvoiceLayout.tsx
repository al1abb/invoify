import { ReactNode } from "react";

// Types
import { InvoiceType } from "@/types";

type InvoiceLayoutProps = {
  data: InvoiceType;
  children: ReactNode;
};

export default function InvoiceLayout({ data, children }: InvoiceLayoutProps) {
  const { details } = data;

  // Only dynamically load the user-selected signature font if needed
  const fontHref = details.signature?.fontFamily
    ? `https://fonts.googleapis.com/css2?family=${details?.signature?.fontFamily}&display=swap`
    : "";

  return (
    <>
      {/* Dynamically load signature font if selected by user */}
      {details.signature?.fontFamily && (
        <link href={fontHref} rel="stylesheet" />
      )}
      <section style={{ fontFamily: "Outfit, sans-serif" }}>
        <div className="flex flex-col p-4 sm:p-10 bg-white rounded-xl min-h-240">
          {children}
        </div>
      </section>
    </>
  );
}
