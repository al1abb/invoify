import { trackClientEvent } from "@/lib/telemetry/clientTelemetry";
import { normalizeInvoiceParty } from "@/lib/storage/normalizeInvoice";
import {
  backupCorruptedLocalStorage,
  safeParseJson,
  safeReadLocalStorage,
  safeRemoveLocalStorage,
  safeWriteLocalStorage,
} from "@/lib/storage/localStorage";
import { TemplatesEnvelopeV2 } from "@/lib/storage/types";
import { CustomerTemplateRecord, InvoiceType } from "@/types";

export const CUSTOMER_TEMPLATES_KEY_V1 = "invoify:customerTemplates:v1";
export const CUSTOMER_TEMPLATES_KEY_V2 = "invoify:customerTemplates:v2";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const toNumber = (value: unknown, fallback: number) => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : fallback;
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sortByUpdatedAt = (records: CustomerTemplateRecord[]) => {
  return [...records].sort((a, b) => b.updatedAt - a.updatedAt);
};

const cloneParty = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

const coerceTemplate = (value: unknown): CustomerTemplateRecord | null => {
  if (!isRecord(value)) return null;

  const now = Date.now();
  const name =
    typeof value.name === "string" && value.name.trim()
      ? value.name.trim()
      : "Saved Template";

  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : createId(),
    name,
    sender: normalizeInvoiceParty(value.sender),
    receiver: normalizeInvoiceParty(value.receiver),
    createdAt: toNumber(value.createdAt, now),
    updatedAt: toNumber(value.updatedAt, now),
  };
};

const toEnvelope = (records: CustomerTemplateRecord[]): TemplatesEnvelopeV2 => {
  return {
    version: 2,
    updatedAt: Date.now(),
    records: sortByUpdatedAt(records),
  };
};

const isEnvelopeV2 = (value: unknown): value is TemplatesEnvelopeV2 => {
  return (
    isRecord(value) &&
    value.version === 2 &&
    typeof value.updatedAt === "number" &&
    Array.isArray(value.records)
  );
};

const persistEnvelope = (records: CustomerTemplateRecord[]) => {
  return safeWriteLocalStorage(
    CUSTOMER_TEMPLATES_KEY_V2,
    JSON.stringify(toEnvelope(records))
  );
};

const recoverCorrupted = (key: string, raw: string, reason: string) => {
  const backupKey = backupCorruptedLocalStorage(key, "customer_templates", raw);
  trackClientEvent(
    "storage_corruption_recovered",
    {
      storageArea: "customer_templates",
      storageKey: key,
      backupKey,
      reason,
    },
    "warn"
  );
};

const readFromV2Envelope = (): CustomerTemplateRecord[] | null => {
  const raw = safeReadLocalStorage(CUSTOMER_TEMPLATES_KEY_V2);
  if (!raw) return null;

  const parsed = safeParseJson(raw);
  if (!parsed.ok) {
    recoverCorrupted(CUSTOMER_TEMPLATES_KEY_V2, raw, "invalid_json");
    return [];
  }

  if (!isEnvelopeV2(parsed.data)) {
    recoverCorrupted(CUSTOMER_TEMPLATES_KEY_V2, raw, "invalid_envelope_shape");
    return [];
  }

  const normalized = parsed.data.records
    .map(coerceTemplate)
    .filter((record): record is CustomerTemplateRecord => Boolean(record));

  const sorted = sortByUpdatedAt(normalized);
  persistEnvelope(sorted);
  return sorted;
};

const migrateFromV1Array = (): CustomerTemplateRecord[] | null => {
  const raw = safeReadLocalStorage(CUSTOMER_TEMPLATES_KEY_V1);
  if (!raw) return null;

  const parsed = safeParseJson(raw);
  if (!parsed.ok) {
    recoverCorrupted(CUSTOMER_TEMPLATES_KEY_V1, raw, "invalid_json");
    return [];
  }

  if (!Array.isArray(parsed.data)) {
    recoverCorrupted(CUSTOMER_TEMPLATES_KEY_V1, raw, "invalid_v1_shape");
    return [];
  }

  const migrated = parsed.data
    .map(coerceTemplate)
    .filter((record): record is CustomerTemplateRecord => Boolean(record));
  const sorted = sortByUpdatedAt(migrated);
  persistEnvelope(sorted);
  safeRemoveLocalStorage(CUSTOMER_TEMPLATES_KEY_V1);

  trackClientEvent("storage_migration_applied", {
    storageArea: "customer_templates",
    fromKey: CUSTOMER_TEMPLATES_KEY_V1,
    fromVersion: 1,
    toKey: CUSTOMER_TEMPLATES_KEY_V2,
    toVersion: 2,
    records: sorted.length,
  });

  return sorted;
};

export const readCustomerTemplates = (): CustomerTemplateRecord[] => {
  const fromV2 = readFromV2Envelope();
  if (fromV2) return fromV2;

  const fromV1 = migrateFromV1Array();
  if (fromV1) return fromV1;

  return [];
};

export const writeCustomerTemplates = (records: CustomerTemplateRecord[]) => {
  return persistEnvelope(sortByUpdatedAt(records));
};

export const createCustomerTemplate = (
  name: string,
  sender: InvoiceType["sender"],
  receiver: InvoiceType["receiver"]
): CustomerTemplateRecord => {
  const now = Date.now();

  return {
    id: createId(),
    name: name.trim(),
    sender: cloneParty(sender),
    receiver: cloneParty(receiver),
    createdAt: now,
    updatedAt: now,
  };
};

export const addCustomerTemplate = (
  records: CustomerTemplateRecord[],
  name: string,
  sender: InvoiceType["sender"],
  receiver: InvoiceType["receiver"]
) => {
  const template = createCustomerTemplate(name, sender, receiver);
  return [template, ...records];
};

export const renameCustomerTemplate = (
  records: CustomerTemplateRecord[],
  id: string,
  nextName: string
) => {
  const trimmedName = nextName.trim();
  if (!trimmedName) return records;

  const now = Date.now();

  return [...records]
    .map((record) =>
      record.id === id
        ? {
            ...record,
            name: trimmedName,
            updatedAt: now,
          }
        : record
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

export const removeCustomerTemplate = (
  records: CustomerTemplateRecord[],
  id: string
) => {
  return records.filter((record) => record.id !== id);
};

export const findCustomerTemplate = (
  records: CustomerTemplateRecord[],
  id: string
) => {
  return records.find((record) => record.id === id) || null;
};
