// Variables
import { EXPORT_INVOICE_API } from "@/lib/variables";
import { toApiErrorMessage } from "@/lib/contracts/invoiceApi";

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

  if (!response.ok) {
    let errorPayload: unknown = null;
    try {
      errorPayload = await response.json();
    } catch {
      // no-op
    }

    throw new Error(
      toApiErrorMessage(errorPayload, `Failed to export invoice (${response.status})`)
    );
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice.${exportAs.toLowerCase()}`;
  a.click();
  window.URL.revokeObjectURL(url);
};
