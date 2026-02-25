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

export type InvoiceTimelineEventType =
    | "created"
    | "status_changed"
    | "payment_recorded"
    | "reminder_sent"
    | "duplicated"
    | "recurring_enabled"
    | "recurring_disabled"
    | "recurring_generated";

export type InvoiceTimelineEvent = {
    id: string;
    type: InvoiceTimelineEventType;
    at: number;
    note?: string;
    amount?: number;
};

export type RecurringFrequency = "weekly" | "monthly";

export type SavedInvoiceRecurringConfig = {
    enabled: boolean;
    frequency: RecurringFrequency | null;
    baseInvoiceNumber: string;
    counter: number;
    lastIssuedAt: number | null;
    nextIssueAt: number | null;
};

export type SavedInvoicePaymentSummary = {
    amountPaid: number;
    lastPaymentAt: number | null;
};

export type SavedInvoiceReminder = {
    enabled: boolean;
    lastSentAt: number | null;
    sendCount: number;
    nextReminderAt: number | null;
};

export type SyncProviderName = "local" | "noop-cloud" | "supabase-rest";

export type SyncState = "idle" | "syncing" | "success" | "skipped" | "error";

export type SyncStatus = {
    state: SyncState;
    provider: SyncProviderName;
    lastAttemptAt: number | null;
    lastSuccessAt: number | null;
    reason: string | null;
    errorMessage: string | null;
};

export type SyncConflictChoice = "local" | "cloud";

export type SyncConflictEntityType = "invoice" | "template";

export type SyncConflictSummary = {
    id: string;
    entityType: SyncConflictEntityType;
    key: string;
    label: string;
    localUpdatedAt: number;
    cloudUpdatedAt: number;
    defaultChoice: SyncConflictChoice;
};

export type SavedInvoiceRecord = {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    createdAt: number;
    updatedAt: number;
    data: InvoiceType;
    recurring: SavedInvoiceRecurringConfig;
    payment: SavedInvoicePaymentSummary;
    reminder: SavedInvoiceReminder;
    timeline: InvoiceTimelineEvent[];
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

export type UserPreferences = {
    defaultCurrency: string;
    defaultTemplateId: number;
    defaultLocale: string;
};

export type EmailMessageOptions = {
    subject?: string;
    body?: string;
    footer?: string;
};

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
