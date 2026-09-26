// Variables
import { EXPORT_INVOICE_API } from "@/lib/variables";

// Types
import { ExportTypes, InvoiceType } from "@/types";

/**
 * Export an invoice by sending a POST request to the server and initiating the download.
 *
 * @param {ExportTypes} exportAs - The format in which to export the invoice (e.g., JSON, CSV).
 * @param {InvoiceType} formValues - The invoice form data to be exported.
 * @throws {Error} If there is an error during the export process.
 * @returns {Promise<void>} A promise that resolves when the export is completed.
 */
export const exportInvoice = async (
    exportAs: ExportTypes,
    formValues: InvoiceType
) => {
    const response = await fetch(`${EXPORT_INVOICE_API}?format=${exportAs}`, {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
            "Content-Type": "application/json",
        },
    });

    /*
     * Without this check an error response was still passed to `.blob()` and
     * downloaded as `invoice.<format>`, so the user got a file containing the
     * server's error text instead of being told the export failed. The
     * server's JSON error body (e.g. exportInvoiceService's XRechnung case
     * names the exact missing field) is surfaced here too, rather than a
     * generic status-code message that can't be acted on.
     */
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
            body?.error || `Export failed with status ${response.status}`
        );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    try {
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice.${EXPORT_FILE_EXTENSIONS[exportAs] ?? exportAs.toLowerCase()}`;
        a.click();
    } finally {
        window.URL.revokeObjectURL(url);
    }
};

/** Format names that aren't already a valid, sensible file extension. */
const EXPORT_FILE_EXTENSIONS: Partial<Record<ExportTypes, string>> = {
    [ExportTypes.XRECHNUNG]: "xrechnung.xml",
};
