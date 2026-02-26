import {
  normalizeDocumentType,
  toDocumentTypeLabel,
} from "@/lib/invoice/documentType";

export const PDF_FILENAME_RECIPIENT_MAX_LENGTH = 64;
export const PDF_FILENAME_INVOICE_NUMBER_MAX_LENGTH = 48;

export type PdfFilenameMeta = {
  recipientName: string;
  invoiceNumber: string;
  documentType?: string | null;
};

export type PdfFilenameSource = {
  receiver?: {
    name?: string | null;
  } | null;
  details?: {
    invoiceNumber?: string | null;
    documentType?: string | null;
  } | null;
};

export const toSafeFilenamePart = (
  value: string,
  removeSpaces = false,
  maxLength = 80
) => {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const withSpacesHandled = removeSpaces
    ? normalized.replace(/\s+/g, "")
    : normalized.replace(/\s+/g, "_");

  const safePart = withSpacesHandled
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/^[-_]+|[-_]+$/g, "");

  return safePart.slice(0, maxLength).replace(/^[-_]+|[-_]+$/g, "");
};

export const toPdfFilenameMeta = (source: PdfFilenameSource): PdfFilenameMeta => {
  return {
    recipientName: source.receiver?.name ?? "",
    invoiceNumber: source.details?.invoiceNumber ?? "",
    documentType: normalizeDocumentType(source.details?.documentType),
  };
};

export const toPdfFilename = (meta: PdfFilenameMeta) => {
  const documentLabel = toDocumentTypeLabel(meta.documentType);
  const invoiceToName = toSafeFilenamePart(
    meta.recipientName,
    false,
    PDF_FILENAME_RECIPIENT_MAX_LENGTH
  );
  const invoiceNumber = toSafeFilenamePart(
    meta.invoiceNumber,
    false,
    PDF_FILENAME_INVOICE_NUMBER_MAX_LENGTH
  );

  return `${invoiceToName || "Client"}_${documentLabel}${
    invoiceNumber ? `_${invoiceNumber}` : ""
  }.pdf`;
};
