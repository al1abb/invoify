export type InvoiceDocumentType = "invoice" | "quote";

export const normalizeDocumentType = (
  value: unknown
): InvoiceDocumentType => {
  return value === "quote" ? "quote" : "invoice";
};

export const toDocumentTypeLabel = (value: unknown): string => {
  return normalizeDocumentType(value) === "quote" ? "Quote" : "Invoice";
};

export const toInvoiceNumberFromQuote = (invoiceNumber: string): string => {
  const trimmed = invoiceNumber.trim();
  if (!trimmed) return trimmed;

  if (/^qte[-_\s]?/i.test(trimmed)) {
    return trimmed.replace(/^qte[-_\s]?/i, "INV-");
  }

  if (/^quote[-_\s]?/i.test(trimmed)) {
    return trimmed.replace(/^quote[-_\s]?/i, "INV-");
  }

  if (/^est(?:imate)?[-_\s]?/i.test(trimmed)) {
    return trimmed.replace(/^est(?:imate)?[-_\s]?/i, "INV-");
  }

  return trimmed;
};
