// Variables
import { EXPORT_INVOICE_API } from "@/lib/variables";

// Types
import { InvoiceType } from "@/app/types/types";

export const exportInvoice = async (
    exportAs: string,
    formValues: InvoiceType
) => {
    return fetch(`${EXPORT_INVOICE_API}?format=${exportAs}`, {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice.${exportAs.toLowerCase()}`;
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error("Error downloading:", error);
        });
};
