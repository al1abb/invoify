import { z } from "zod";

import { InvoiceSchema } from "@/lib/schemas";
import { ExportTypes } from "@/types";

export const MAX_EMAIL_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const toDateCompatibleInvoicePayload = (payload: unknown) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  const draft = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
  const details =
    draft.details && typeof draft.details === "object" && !Array.isArray(draft.details)
      ? (draft.details as Record<string, unknown>)
      : null;

  if (!details) return draft;

  for (const key of ["invoiceDate", "dueDate"] as const) {
    const raw = details[key];
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
      continue;
    }

    const parsed = Date.parse(String(raw ?? ""));
    if (Number.isFinite(parsed)) {
      details[key] = new Date(parsed);
    }
  }

  return draft;
};

export const invoiceGenerateRequestSchema = z.preprocess(
  toDateCompatibleInvoicePayload,
  InvoiceSchema
);

export const invoiceExportRequestSchema = z.preprocess(
  toDateCompatibleInvoicePayload,
  InvoiceSchema
);

export const invoiceExportQuerySchema = z.object({
  format: z.nativeEnum(ExportTypes),
});

export const invoiceSendRequestSchema = z.object({
  email: z.string().trim().email(),
  invoiceNumber: z.string().trim().min(1),
  documentType: z.enum(["invoice", "quote"]).optional(),
  subject: z.string().trim().max(160).optional(),
  body: z.string().trim().max(5000).optional(),
  footer: z.string().trim().max(500).optional(),
  attachmentSizeBytes: z
    .number()
    .int()
    .positive()
    .max(MAX_EMAIL_ATTACHMENT_BYTES),
});

export const invoiceApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export type InvoiceApiErrorPayload = z.infer<typeof invoiceApiErrorSchema>;

export const toApiErrorMessage = (
  payload: unknown,
  fallback = "Request failed"
): string => {
  const parsed = invoiceApiErrorSchema.safeParse(payload);
  if (!parsed.success) return fallback;
  return parsed.data.error.message || fallback;
};
