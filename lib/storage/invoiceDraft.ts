import { trackClientEvent } from "@/lib/telemetry/clientTelemetry";
import { LOCAL_STORAGE_INVOICE_DRAFT_KEY } from "@/lib/variables";
import { InvoiceType } from "@/types";

import { normalizeInvoiceDraft } from "@/lib/storage/normalizeInvoice";
import {
  backupCorruptedLocalStorage,
  safeParseJson,
  safeReadLocalStorage,
  safeRemoveLocalStorage,
  safeWriteLocalStorage,
} from "@/lib/storage/localStorage";
import { DraftEnvelopeV2 } from "@/lib/storage/types";

export const INVOICE_DRAFT_KEY_V2 = "invoify:invoiceDraft:v2";

type DraftReadResult = {
  draft: InvoiceType | null;
  migrated: boolean;
  corruptionRecovered: boolean;
  backupKey: string | null;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isDraftEnvelopeV2 = (value: unknown): value is DraftEnvelopeV2 => {
  return (
    isRecord(value) &&
    value.version === 2 &&
    typeof value.updatedAt === "number" &&
    isRecord(value.data)
  );
};

const toDraftEnvelope = (draft: InvoiceType): DraftEnvelopeV2 => {
  return {
    version: 2,
    updatedAt: Date.now(),
    data: draft,
  };
};

const backupAsCorrupted = (sourceKey: string, raw: string, reason: string) => {
  const backupKey = backupCorruptedLocalStorage(sourceKey, "invoice_draft", raw);
  trackClientEvent(
    "storage_corruption_recovered",
    {
      storageKey: sourceKey,
      backupKey,
      reason,
    },
    "warn"
  );
  return backupKey;
};

const migrateToV2 = (draft: InvoiceType, fromKey: string) => {
  safeWriteLocalStorage(INVOICE_DRAFT_KEY_V2, JSON.stringify(toDraftEnvelope(draft)));
  if (fromKey !== INVOICE_DRAFT_KEY_V2) {
    safeRemoveLocalStorage(fromKey);
  }

  trackClientEvent("storage_migration_applied", {
    storageArea: "invoice_draft",
    fromKey,
    toKey: INVOICE_DRAFT_KEY_V2,
    toVersion: 2,
  });
};

const readFromKey = (key: string): DraftReadResult | null => {
  const raw = safeReadLocalStorage(key);
  if (!raw) return null;

  const parsed = safeParseJson(raw);
  if (!parsed.ok) {
    const backupKey = backupAsCorrupted(key, raw, "invalid_json");
    return {
      draft: null,
      migrated: false,
      corruptionRecovered: true,
      backupKey,
    };
  }

  if (isDraftEnvelopeV2(parsed.data)) {
    const normalized = normalizeInvoiceDraft(parsed.data.data);
    if (!normalized) {
      const backupKey = backupAsCorrupted(key, raw, "invalid_envelope_data");
      return {
        draft: null,
        migrated: false,
        corruptionRecovered: true,
        backupKey,
      };
    }

    const normalizedEnvelope = toDraftEnvelope(normalized);
    safeWriteLocalStorage(key, JSON.stringify(normalizedEnvelope));

    return {
      draft: normalized,
      migrated: false,
      corruptionRecovered: false,
      backupKey: null,
    };
  }

  // Legacy payload without an envelope.
  const legacyNormalized = normalizeInvoiceDraft(parsed.data);
  if (!legacyNormalized) {
    const backupKey = backupAsCorrupted(key, raw, "legacy_shape_unrecoverable");
    return {
      draft: null,
      migrated: false,
      corruptionRecovered: true,
      backupKey,
    };
  }

  migrateToV2(legacyNormalized, key);
  return {
    draft: legacyNormalized,
    migrated: true,
    corruptionRecovered: false,
    backupKey: null,
  };
};

export const readInvoiceDraft = (): DraftReadResult => {
  const primary = readFromKey(INVOICE_DRAFT_KEY_V2);
  if (primary) return primary;

  const legacy = readFromKey(LOCAL_STORAGE_INVOICE_DRAFT_KEY);
  if (legacy) return legacy;

  return {
    draft: null,
    migrated: false,
    corruptionRecovered: false,
    backupKey: null,
  };
};

export const writeInvoiceDraft = (draft: unknown) => {
  const normalized = normalizeInvoiceDraft(draft);
  if (!normalized) return false;

  return safeWriteLocalStorage(
    INVOICE_DRAFT_KEY_V2,
    JSON.stringify(toDraftEnvelope(normalized))
  );
};

export const clearInvoiceDraft = () => {
  const removedPrimary = safeRemoveLocalStorage(INVOICE_DRAFT_KEY_V2);
  const removedLegacy = safeRemoveLocalStorage(LOCAL_STORAGE_INVOICE_DRAFT_KEY);
  return removedPrimary || removedLegacy;
};
