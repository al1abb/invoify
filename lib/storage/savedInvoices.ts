import {
  InvoiceStatus,
  InvoiceTimelineEvent,
  InvoiceTimelineEventType,
  InvoiceType,
  RecurringFrequency,
  SavedInvoiceRecord,
} from "@/types";
import { trackClientEvent } from "@/lib/telemetry/clientTelemetry";
import { normalizeInvoiceDraft } from "@/lib/storage/normalizeInvoice";
import {
  backupCorruptedLocalStorage,
  safeParseJson,
  safeReadLocalStorage,
  safeRemoveLocalStorage,
  safeWriteLocalStorage,
} from "@/lib/storage/localStorage";
import { SavedInvoicesEnvelopeV3 } from "@/lib/storage/types";

export const LEGACY_SAVED_INVOICES_KEY = "savedInvoices";
export const SAVED_INVOICES_KEY_V2 = "invoify:savedInvoices:v2";
export const SAVED_INVOICES_KEY_V3 = "invoify:savedInvoices:v3";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const cloneInvoice = (invoice: InvoiceType): InvoiceType => {
  return JSON.parse(JSON.stringify(invoice)) as InvoiceType;
};

const toBaseInvoiceNumber = (invoiceNumber: string) => {
  const trimmed = invoiceNumber.trim();
  if (!trimmed) return "invoice";

  return trimmed.replace(/-R\d+$/i, "");
};

const addRecurringInterval = (fromTimestamp: number, frequency: RecurringFrequency) => {
  const nextDate = new Date(fromTimestamp);

  if (frequency === "monthly") {
    nextDate.setMonth(nextDate.getMonth() + 1);
    return nextDate.getTime();
  }

  nextDate.setDate(nextDate.getDate() + 7);
  return nextDate.getTime();
};

const toTimestamp = (value: unknown) => {
  const parsed = Date.parse(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const getInvoiceTotal = (record: SavedInvoiceRecord) => {
  const total = Number(record.data.details.totalAmount);
  return Number.isFinite(total) ? Math.max(0, total) : 0;
};

const createTimelineEvent = (
  type: InvoiceTimelineEventType,
  at: number,
  options?: {
    note?: string;
    amount?: number;
  }
): InvoiceTimelineEvent => {
  return {
    id: createId(),
    type,
    at,
    ...(options?.note ? { note: options.note } : {}),
    ...(typeof options?.amount === "number" ? { amount: options.amount } : {}),
  };
};

const appendTimelineEvent = (
  record: SavedInvoiceRecord,
  event: InvoiceTimelineEvent
) => {
  const nextTimeline = [event, ...record.timeline]
    .sort((a, b) => b.at - a.at)
    .slice(0, 50);

  return {
    ...record,
    timeline: nextTimeline,
  };
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isStatus = (value: unknown): value is InvoiceStatus => {
  return value === "draft" || value === "sent" || value === "paid";
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

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || typeof value === "undefined") return null;

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : NaN;

  return Number.isFinite(parsed) ? parsed : null;
};

const sortByUpdatedAt = (records: SavedInvoiceRecord[]) => {
  return [...records].sort((a, b) => b.updatedAt - a.updatedAt);
};

const readLegacyInvoices = (): InvoiceType[] => {
  const raw = safeReadLocalStorage(LEGACY_SAVED_INVOICES_KEY);

  if (!raw) return [];

  const parsed = safeParseJson(raw);
  if (!parsed.ok || !Array.isArray(parsed.data)) {
    return [];
  }

  return parsed.data
    .map((entry) => normalizeInvoiceDraft(entry))
    .filter((entry): entry is InvoiceType => Boolean(entry));
};

const toDefaultRecurring = (invoiceNumber: string) => {
  return {
    enabled: false,
    frequency: null,
    baseInvoiceNumber: toBaseInvoiceNumber(invoiceNumber),
    counter: 0,
    lastIssuedAt: null,
    nextIssueAt: null,
  };
};

const toDefaultPayment = () => {
  return {
    amountPaid: 0,
    lastPaymentAt: null,
  };
};

const toDefaultReminder = () => {
  return {
    enabled: true,
    lastSentAt: null,
    sendCount: 0,
    nextReminderAt: null,
  };
};

const coerceTimeline = (value: unknown, createdAt: number): InvoiceTimelineEvent[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return [createTimelineEvent("created", createdAt)];
  }

  const timeline: InvoiceTimelineEvent[] = value
    .filter((entry) => isRecord(entry))
    .map((entry) => {
      const typeValue = entry.type;
      const type: InvoiceTimelineEventType =
        typeValue === "status_changed" ||
        typeValue === "payment_recorded" ||
        typeValue === "reminder_sent" ||
        typeValue === "duplicated" ||
        typeValue === "recurring_enabled" ||
        typeValue === "recurring_disabled" ||
        typeValue === "recurring_generated" ||
        typeValue === "created"
          ? typeValue
          : "created";

      return {
        id:
          typeof entry.id === "string" && entry.id.trim()
            ? entry.id
            : createId(),
        type,
        at: toNumber(entry.at, createdAt),
        ...(typeof entry.note === "string" ? { note: entry.note } : {}),
        ...(typeof entry.amount === "number" ? { amount: entry.amount } : {}),
      };
    })
    .sort((a, b) => b.at - a.at)
    .slice(0, 50);

  return timeline.length > 0 ? timeline : [createTimelineEvent("created", createdAt)];
};

const coerceRecord = (value: unknown): SavedInvoiceRecord | null => {
  if (!isRecord(value)) return null;

  const now = Date.now();
  const invoiceData = normalizeInvoiceDraft(value.data);
  if (!invoiceData) return null;

  const fallbackInvoiceNumber = invoiceData.details.invoiceNumber?.trim();
  const invoiceNumber =
    typeof value.invoiceNumber === "string" && value.invoiceNumber.trim()
      ? value.invoiceNumber.trim()
      : fallbackInvoiceNumber || `invoice-${now}`;

  const createdAt = toNumber(value.createdAt, now);
  const updatedAt = toNumber(value.updatedAt, createdAt);
  const recurringSource = isRecord(value.recurring) ? value.recurring : {};
  const paymentSource = isRecord(value.payment) ? value.payment : {};
  const reminderSource = isRecord(value.reminder) ? value.reminder : {};
  const recurringFrequency =
    recurringSource.frequency === "weekly" || recurringSource.frequency === "monthly"
      ? recurringSource.frequency
      : null;

  invoiceData.details.invoiceNumber = invoiceNumber;

  return normalizeRecord({
    id: typeof value.id === "string" && value.id.trim() ? value.id : createId(),
    invoiceNumber,
    status: isStatus(value.status) ? value.status : "draft",
    createdAt,
    updatedAt,
    data: invoiceData,
    recurring: {
      ...toDefaultRecurring(invoiceNumber),
      enabled: Boolean(recurringSource.enabled && recurringFrequency),
      frequency: recurringFrequency,
      baseInvoiceNumber:
        typeof recurringSource.baseInvoiceNumber === "string" &&
        recurringSource.baseInvoiceNumber.trim()
          ? recurringSource.baseInvoiceNumber
          : toBaseInvoiceNumber(invoiceNumber),
      counter: Math.max(0, toNumber(recurringSource.counter, 0)),
      lastIssuedAt: toNullableNumber(recurringSource.lastIssuedAt),
      nextIssueAt: toNullableNumber(recurringSource.nextIssueAt),
    },
    payment: {
      amountPaid: Math.max(0, toNumber(paymentSource.amountPaid, 0)),
      lastPaymentAt: toNullableNumber(paymentSource.lastPaymentAt),
    },
    reminder: {
      enabled:
        typeof reminderSource.enabled === "boolean"
          ? reminderSource.enabled
          : true,
      lastSentAt: toNullableNumber(reminderSource.lastSentAt),
      sendCount: Math.max(0, toNumber(reminderSource.sendCount, 0)),
      nextReminderAt: toNullableNumber(reminderSource.nextReminderAt),
    },
    timeline: coerceTimeline(value.timeline, createdAt),
  });
};

const normalizeRecord = (record: SavedInvoiceRecord): SavedInvoiceRecord => {
  const recurring = record.recurring || toDefaultRecurring(record.invoiceNumber);
  const payment = record.payment || toDefaultPayment();
  const reminder = record.reminder || toDefaultReminder();
  const timeline = Array.isArray(record.timeline) ? record.timeline : [];

  const normalizedTimeline = timeline.length
    ? timeline
        .filter(
          (event) =>
            event &&
            typeof event.id === "string" &&
            typeof event.type === "string" &&
            typeof event.at === "number"
        )
        .sort((a, b) => b.at - a.at)
        .slice(0, 50)
    : [createTimelineEvent("created", record.createdAt)];

  return {
    ...record,
    recurring: {
      ...toDefaultRecurring(record.invoiceNumber),
      ...recurring,
      baseInvoiceNumber:
        recurring.baseInvoiceNumber || toBaseInvoiceNumber(record.invoiceNumber),
    },
    payment: {
      ...toDefaultPayment(),
      ...payment,
      amountPaid: Math.max(0, Number(payment.amountPaid || 0)),
    },
    reminder: {
      ...toDefaultReminder(),
      ...reminder,
      sendCount: Math.max(0, Number(reminder.sendCount || 0)),
    },
    timeline: normalizedTimeline,
  };
};

const toRecord = (
  invoice: InvoiceType,
  status: InvoiceStatus,
  existing?: SavedInvoiceRecord
): SavedInvoiceRecord => {
  const now = Date.now();
  const invoiceNumber = invoice.details.invoiceNumber || `invoice-${now}`;

  if (existing) {
    const normalizedExisting = normalizeRecord(existing);
    const nextStatus = normalizedExisting.status ?? status;

    let nextRecord: SavedInvoiceRecord = {
      ...normalizedExisting,
      invoiceNumber,
      status: nextStatus,
      updatedAt: now,
      data: cloneInvoice(invoice),
      recurring: {
        ...normalizedExisting.recurring,
        baseInvoiceNumber:
          normalizedExisting.recurring.baseInvoiceNumber ||
          toBaseInvoiceNumber(invoiceNumber),
      },
    };

    if (normalizedExisting.status !== nextStatus) {
      nextRecord = appendTimelineEvent(
        nextRecord,
        createTimelineEvent("status_changed", now, {
          note: `${normalizedExisting.status} -> ${nextStatus}`,
        })
      );
    }

    return nextRecord;
  }

  return {
    id: createId(),
    invoiceNumber,
    status,
    createdAt: now,
    updatedAt: now,
    data: cloneInvoice(invoice),
    recurring: toDefaultRecurring(invoiceNumber),
    payment: toDefaultPayment(),
    reminder: toDefaultReminder(),
    timeline: [createTimelineEvent("created", now)],
  };
};

const toEnvelope = (records: SavedInvoiceRecord[]): SavedInvoicesEnvelopeV3 => {
  return {
    version: 3,
    updatedAt: Date.now(),
    records: sortByUpdatedAt(records.map(normalizeRecord)),
  };
};

const isSavedInvoicesEnvelopeV3 = (value: unknown): value is SavedInvoicesEnvelopeV3 => {
  return (
    isRecord(value) &&
    value.version === 3 &&
    typeof value.updatedAt === "number" &&
    Array.isArray(value.records)
  );
};

const persistEnvelope = (records: SavedInvoiceRecord[]) => {
  return safeWriteLocalStorage(
    SAVED_INVOICES_KEY_V3,
    JSON.stringify(toEnvelope(records))
  );
};

const recoverCorruptedStorage = (key: string, raw: string, reason: string) => {
  const backupKey = backupCorruptedLocalStorage(key, "saved_invoices", raw);
  trackClientEvent(
    "storage_corruption_recovered",
    {
      storageArea: "saved_invoices",
      storageKey: key,
      backupKey,
      reason,
    },
    "warn"
  );
};

const readFromEnvelope = (): SavedInvoiceRecord[] | null => {
  const raw = safeReadLocalStorage(SAVED_INVOICES_KEY_V3);
  if (!raw) return null;

  const parsed = safeParseJson(raw);
  if (!parsed.ok) {
    recoverCorruptedStorage(SAVED_INVOICES_KEY_V3, raw, "invalid_json");
    return [];
  }

  if (!isSavedInvoicesEnvelopeV3(parsed.data)) {
    recoverCorruptedStorage(SAVED_INVOICES_KEY_V3, raw, "invalid_envelope_shape");
    return [];
  }

  const normalized = parsed.data.records
    .map(coerceRecord)
    .filter((record): record is SavedInvoiceRecord => Boolean(record));

  const sorted = sortByUpdatedAt(normalized);
  persistEnvelope(sorted);
  return sorted;
};

const migrateFromV2Array = (): SavedInvoiceRecord[] | null => {
  const raw = safeReadLocalStorage(SAVED_INVOICES_KEY_V2);
  if (!raw) return null;

  const parsed = safeParseJson(raw);
  if (!parsed.ok) {
    recoverCorruptedStorage(SAVED_INVOICES_KEY_V2, raw, "invalid_json");
    return [];
  }

  if (!Array.isArray(parsed.data)) {
    recoverCorruptedStorage(SAVED_INVOICES_KEY_V2, raw, "invalid_v2_shape");
    return [];
  }

  const migrated = parsed.data
    .map(coerceRecord)
    .filter((record): record is SavedInvoiceRecord => Boolean(record));
  const sorted = sortByUpdatedAt(migrated);
  persistEnvelope(sorted);
  safeRemoveLocalStorage(SAVED_INVOICES_KEY_V2);

  trackClientEvent("storage_migration_applied", {
    storageArea: "saved_invoices",
    fromKey: SAVED_INVOICES_KEY_V2,
    fromVersion: 2,
    toKey: SAVED_INVOICES_KEY_V3,
    toVersion: 3,
    records: sorted.length,
  });

  return sorted;
};

export const readSavedInvoices = (): SavedInvoiceRecord[] => {
  const fromV3 = readFromEnvelope();
  if (fromV3) return fromV3;

  const fromV2 = migrateFromV2Array();
  if (fromV2) return fromV2;

  const legacyInvoices = readLegacyInvoices();
  if (!legacyInvoices.length) return [];

  const migrated = sortByUpdatedAt(
    legacyInvoices.map((invoice) => toRecord(invoice, "draft"))
  );

  persistEnvelope(migrated);
  safeRemoveLocalStorage(LEGACY_SAVED_INVOICES_KEY);
  trackClientEvent("storage_migration_applied", {
    storageArea: "saved_invoices",
    fromKey: LEGACY_SAVED_INVOICES_KEY,
    fromVersion: 1,
    toKey: SAVED_INVOICES_KEY_V3,
    toVersion: 3,
    records: migrated.length,
  });
  return migrated;
};

export const writeSavedInvoices = (records: SavedInvoiceRecord[]) => {
  return persistEnvelope(records);
};

export const upsertSavedInvoiceRecord = (
  records: SavedInvoiceRecord[],
  invoice: InvoiceType,
  status: InvoiceStatus = "draft"
) => {
  const invoiceNumber = invoice.details.invoiceNumber;
  const existing = records.find((record) => record.invoiceNumber === invoiceNumber);

  if (existing) {
    const nextRecord = toRecord(invoice, status, existing);
    const nextRecords = sortByUpdatedAt(
      records.map((record) =>
        record.id === existing.id ? normalizeRecord(nextRecord) : normalizeRecord(record)
      )
    );

    return {
      nextRecords,
      record: nextRecord,
    };
  }

  const newRecord = toRecord(invoice, status);
  return {
    nextRecords: sortByUpdatedAt([newRecord, ...records.map(normalizeRecord)]),
    record: newRecord,
  };
};

export const removeSavedInvoiceRecord = (
  records: SavedInvoiceRecord[],
  id: string
) => {
  return records.filter((record) => record.id !== id);
};

const nextDuplicateInvoiceNumber = (
  invoiceNumber: string,
  records: SavedInvoiceRecord[]
) => {
  const normalizedBase = invoiceNumber.trim() || "invoice";
  const baseCandidate = `${normalizedBase}-copy`;

  if (!records.some((record) => record.invoiceNumber === baseCandidate)) {
    return baseCandidate;
  }

  let counter = 2;
  let candidate = `${normalizedBase}-copy-${counter}`;

  while (records.some((record) => record.invoiceNumber === candidate)) {
    counter += 1;
    candidate = `${normalizedBase}-copy-${counter}`;
  }

  return candidate;
};

export const duplicateSavedInvoiceRecord = (
  records: SavedInvoiceRecord[],
  id: string
) => {
  const source = records.find((record) => record.id === id);
  if (!source) return records;

  const normalizedSource = normalizeRecord(source);
  const duplicatedInvoice = cloneInvoice(normalizedSource.data);
  duplicatedInvoice.details.invoiceNumber = nextDuplicateInvoiceNumber(
    source.invoiceNumber,
    records
  );

  const now = Date.now();
  const duplicated: SavedInvoiceRecord = {
    id: createId(),
    invoiceNumber: duplicatedInvoice.details.invoiceNumber,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    data: duplicatedInvoice,
    recurring: toDefaultRecurring(duplicatedInvoice.details.invoiceNumber),
    payment: toDefaultPayment(),
    reminder: toDefaultReminder(),
    timeline: [
      createTimelineEvent("created", now, {
        note: `Created from ${normalizedSource.invoiceNumber}`,
      }),
      createTimelineEvent("duplicated", now, {
        note: `Duplicated from ${normalizedSource.invoiceNumber}`,
      }),
    ],
  };

  return sortByUpdatedAt([duplicated, ...records.map(normalizeRecord)]);
};

export const updateSavedInvoiceStatus = (
  records: SavedInvoiceRecord[],
  id: string,
  status: InvoiceStatus
) => {
  const now = Date.now();

  return sortByUpdatedAt(
    records.map((record) => {
      const normalized = normalizeRecord(record);
      if (normalized.id !== id) return normalized;

      let nextRecord: SavedInvoiceRecord = {
        ...normalized,
        status,
        updatedAt: now,
      };

      if (normalized.status !== status) {
        nextRecord = appendTimelineEvent(
          nextRecord,
          createTimelineEvent("status_changed", now, {
            note: `${normalized.status} -> ${status}`,
          })
        );
      }

      return nextRecord;
    })
  );
};

export const updateSavedInvoiceStatusByInvoiceNumber = (
  records: SavedInvoiceRecord[],
  invoiceNumber: string,
  status: InvoiceStatus
) => {
  const target = records.find((record) => record.invoiceNumber === invoiceNumber);
  if (!target) return records;

  return updateSavedInvoiceStatus(records, target.id, status);
};

export const findSavedInvoiceByInvoiceNumber = (
  records: SavedInvoiceRecord[],
  invoiceNumber: string
) => {
  return records.find((record) => record.invoiceNumber === invoiceNumber) || null;
};

export const getSavedInvoiceBalance = (record: SavedInvoiceRecord) => {
  const normalized = normalizeRecord(record);
  const total = getInvoiceTotal(normalized);
  const paid = Math.max(0, normalized.payment.amountPaid);
  return Math.max(0, total - paid);
};

export const isSavedInvoiceOverdue = (
  record: SavedInvoiceRecord,
  now = Date.now()
) => {
  const normalized = normalizeRecord(record);
  if (normalized.status === "paid") return false;

  const dueAt = toTimestamp(normalized.data.details.dueDate);
  if (!dueAt) return false;

  return dueAt < now;
};

export const recordSavedInvoicePayment = (
  records: SavedInvoiceRecord[],
  id: string,
  amount: number
) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    return records;
  }

  const now = Date.now();

  return sortByUpdatedAt(
    records.map((record) => {
      const normalized = normalizeRecord(record);
      if (normalized.id !== id) return normalized;

      const total = getInvoiceTotal(normalized);
      const nextPaid = normalized.payment.amountPaid + amount;
      const amountPaid = total > 0 ? Math.min(nextPaid, total) : nextPaid;
      const nextStatus: InvoiceStatus =
        total > 0 && amountPaid >= total ? "paid" : normalized.status;

      let nextRecord: SavedInvoiceRecord = {
        ...normalized,
        status: nextStatus,
        updatedAt: now,
        payment: {
          amountPaid,
          lastPaymentAt: now,
        },
      };

      nextRecord = appendTimelineEvent(
        nextRecord,
        createTimelineEvent("payment_recorded", now, {
          amount,
        })
      );

      if (normalized.status !== nextStatus) {
        nextRecord = appendTimelineEvent(
          nextRecord,
          createTimelineEvent("status_changed", now, {
            note: `${normalized.status} -> ${nextStatus}`,
          })
        );
      }

      return nextRecord;
    })
  );
};

export const markSavedInvoiceReminderSent = (
  records: SavedInvoiceRecord[],
  id: string
) => {
  const now = Date.now();

  return sortByUpdatedAt(
    records.map((record) => {
      const normalized = normalizeRecord(record);
      if (normalized.id !== id) return normalized;

      let nextRecord: SavedInvoiceRecord = {
        ...normalized,
        updatedAt: now,
        reminder: {
          ...normalized.reminder,
          enabled: true,
          sendCount: normalized.reminder.sendCount + 1,
          lastSentAt: now,
          nextReminderAt: now + SEVEN_DAYS_MS,
        },
      };

      nextRecord = appendTimelineEvent(
        nextRecord,
        createTimelineEvent("reminder_sent", now)
      );

      return nextRecord;
    })
  );
};

export const setSavedInvoiceRecurring = (
  records: SavedInvoiceRecord[],
  id: string,
  frequency: RecurringFrequency | null
) => {
  const now = Date.now();

  return sortByUpdatedAt(
    records.map((record) => {
      const normalized = normalizeRecord(record);
      if (normalized.id !== id) return normalized;

      let nextRecord: SavedInvoiceRecord = {
        ...normalized,
        updatedAt: now,
        recurring: {
          ...normalized.recurring,
          enabled: Boolean(frequency),
          frequency,
          baseInvoiceNumber:
            normalized.recurring.baseInvoiceNumber ||
            toBaseInvoiceNumber(normalized.invoiceNumber),
          nextIssueAt: frequency
            ? addRecurringInterval(
                toTimestamp(normalized.data.details.invoiceDate) || now,
                frequency
              )
            : null,
        },
      };

      nextRecord = appendTimelineEvent(
        nextRecord,
        createTimelineEvent(
          frequency ? "recurring_enabled" : "recurring_disabled",
          now,
          frequency ? { note: frequency } : undefined
        )
      );

      return nextRecord;
    })
  );
};

export const generateNextRecurringInvoice = (
  records: SavedInvoiceRecord[],
  id: string
) => {
  const source = records.find((record) => record.id === id);
  if (!source) return records;

  const normalizedSource = normalizeRecord(source);
  if (!normalizedSource.recurring.enabled || !normalizedSource.recurring.frequency) {
    return records;
  }

  const frequency = normalizedSource.recurring.frequency;
  const baseInvoiceNumber =
    normalizedSource.recurring.baseInvoiceNumber ||
    toBaseInvoiceNumber(normalizedSource.invoiceNumber);

  let nextCounter = normalizedSource.recurring.counter;
  let nextInvoiceNumber = "";

  do {
    nextCounter += 1;
    nextInvoiceNumber = `${baseInvoiceNumber}-R${nextCounter}`;
  } while (records.some((record) => record.invoiceNumber === nextInvoiceNumber));

  const now = Date.now();
  const invoiceDateAt = toTimestamp(normalizedSource.data.details.invoiceDate) || now;
  const dueDateAt = toTimestamp(normalizedSource.data.details.dueDate);
  const nextInvoiceDateAt = addRecurringInterval(invoiceDateAt, frequency);

  const nextDueDateAt = dueDateAt
    ? Math.max(nextInvoiceDateAt, nextInvoiceDateAt + (dueDateAt - invoiceDateAt))
    : addRecurringInterval(nextInvoiceDateAt, frequency);

  const nextInvoice = cloneInvoice(normalizedSource.data);
  nextInvoice.details.invoiceNumber = nextInvoiceNumber;
  nextInvoice.details.invoiceDate = new Date(nextInvoiceDateAt).toISOString();
  nextInvoice.details.dueDate = new Date(nextDueDateAt).toISOString();
  nextInvoice.details.updatedAt = new Date(now).toLocaleString();

  const nextRecord: SavedInvoiceRecord = {
    id: createId(),
    invoiceNumber: nextInvoiceNumber,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    data: nextInvoice,
    recurring: {
      enabled: true,
      frequency,
      baseInvoiceNumber,
      counter: nextCounter,
      lastIssuedAt: now,
      nextIssueAt: addRecurringInterval(nextInvoiceDateAt, frequency),
    },
    payment: toDefaultPayment(),
    reminder: toDefaultReminder(),
    timeline: [
      createTimelineEvent("created", now, {
        note: `Recurring from ${normalizedSource.invoiceNumber}`,
      }),
      createTimelineEvent("recurring_generated", now, {
        note: `Generated from ${normalizedSource.invoiceNumber}`,
      }),
    ],
  };

  const updatedSource = appendTimelineEvent(
    {
      ...normalizedSource,
      updatedAt: now,
      recurring: {
        ...normalizedSource.recurring,
        enabled: true,
        frequency,
        baseInvoiceNumber,
        counter: nextCounter,
        lastIssuedAt: now,
        nextIssueAt: addRecurringInterval(nextInvoiceDateAt, frequency),
      },
    },
    createTimelineEvent("recurring_generated", now, {
      note: `Generated ${nextInvoiceNumber}`,
    })
  );

  const nextRecords = records.map((record) =>
    record.id === updatedSource.id ? updatedSource : normalizeRecord(record)
  );

  return sortByUpdatedAt([nextRecord, ...nextRecords]);
};
