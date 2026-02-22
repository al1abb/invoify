// Zod
import z from "zod";

// RHF
import { FieldPath, UseFormReturn } from "react-hook-form";

// Zod schemas
import { InvoiceSchema, ItemSchema } from "@/lib/schemas";

// Form types
export type InvoiceType = z.infer<typeof InvoiceSchema>;
export type ItemType = z.infer<typeof ItemSchema>;
export type FormType = UseFormReturn<InvoiceType>;
export type NameType = FieldPath<InvoiceType>;

export type InvoiceStatus = "draft" | "sent" | "paid";

export type SavedInvoiceRecord = {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    createdAt: number;
    updatedAt: number;
    data: InvoiceType;
};

export type CustomerTemplateRecord = {
    id: string;
    name: string;
    sender: InvoiceType["sender"];
    receiver: InvoiceType["receiver"];
    createdAt: number;
    updatedAt: number;
};

export type CachedPdfRecord = {
    invoiceNumber: string;
    pdfBlob: Blob;
    mimeType: "application/pdf";
    sizeBytes: number;
    createdAt: number;
    updatedAt: number;
};

export type CachedPdfMeta = Omit<CachedPdfRecord, "pdfBlob" | "mimeType">;

export type CurrencyType = {
    [currencyCode: string]: string;
};

export type CurrencyDetails = {
    currency: string;
    decimals: number;
    beforeDecimal: string | null;
    afterDecimal: string | null;
};

// Signature types
export type SignatureColor = {
    name: string;
    label: string;
    color: string;
};

export type SignatureFont = {
    name: string;
    variable: string;
};

export enum SignatureTabs {
    DRAW = "draw",
    TYPE = "type",
    UPLOAD = "upload",
}

// Wizard types
export type WizardStepType = {
    id: number;
    label: string;
    isValid?: boolean;
};

// Export types
export enum ExportTypes {
    JSON = "JSON",
    CSV = "CSV",
    XML = "XML",
    DOCX = "DOCX",
}
