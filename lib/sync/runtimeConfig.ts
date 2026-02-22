import { InvoiceSyncProviderName } from "@/lib/sync/types";

const toPositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

export const SYNC_DEFAULTS = {
  debounceMs: 5000,
  maxInvoices: 250,
  maxTemplates: 100,
  maxPayloadBytes: 512 * 1024,
  retryMaxAttempts: 3,
  retryBaseDelayMs: 1000,
} as const;

const toSyncProvider = (
  value: string | undefined
): InvoiceSyncProviderName => {
  if (value === "local" || value === "noop-cloud" || value === "supabase-rest") {
    return value;
  }

  return "local";
};

export const getSyncRuntimeConfig = () => {
  return {
    provider: toSyncProvider(process.env.NEXT_PUBLIC_INVOICE_SYNC_PROVIDER),
    debounceMs: toPositiveInt(
      process.env.NEXT_PUBLIC_SYNC_DEBOUNCE_MS,
      SYNC_DEFAULTS.debounceMs
    ),
    maxInvoices: toPositiveInt(
      process.env.NEXT_PUBLIC_SYNC_MAX_INVOICES,
      SYNC_DEFAULTS.maxInvoices
    ),
    maxTemplates: toPositiveInt(
      process.env.NEXT_PUBLIC_SYNC_MAX_TEMPLATES,
      SYNC_DEFAULTS.maxTemplates
    ),
    maxPayloadBytes: toPositiveInt(
      process.env.NEXT_PUBLIC_SYNC_MAX_PAYLOAD_BYTES,
      SYNC_DEFAULTS.maxPayloadBytes
    ),
    retryMaxAttempts: toPositiveInt(
      process.env.NEXT_PUBLIC_SYNC_RETRY_MAX_ATTEMPTS,
      SYNC_DEFAULTS.retryMaxAttempts
    ),
    retryBaseDelayMs: toPositiveInt(
      process.env.NEXT_PUBLIC_SYNC_RETRY_BASE_DELAY_MS,
      SYNC_DEFAULTS.retryBaseDelayMs
    ),
    syncIngestUrl: process.env.NEXT_PUBLIC_SYNC_INGEST_URL || "",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    syncAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  };
};
