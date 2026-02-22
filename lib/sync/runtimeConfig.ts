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
} as const;

export const getSyncRuntimeConfig = () => {
  return {
    provider: process.env.NEXT_PUBLIC_INVOICE_SYNC_PROVIDER || "local",
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
    syncIngestUrl: process.env.NEXT_PUBLIC_SYNC_INGEST_URL || "",
    syncAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  };
};
