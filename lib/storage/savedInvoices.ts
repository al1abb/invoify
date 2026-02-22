import { InvoiceStatus, InvoiceType, SavedInvoiceRecord } from "@/types";

export const LEGACY_SAVED_INVOICES_KEY = "savedInvoices";
export const SAVED_INVOICES_KEY_V2 = "invoify:savedInvoices:v2";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const cloneInvoice = (invoice: InvoiceType): InvoiceType => {
  return JSON.parse(JSON.stringify(invoice)) as InvoiceType;
};

const isRecordArray = (value: unknown): value is SavedInvoiceRecord[] => {
  if (!Array.isArray(value)) return false;

  return value.every((record) => {
    return (
      typeof record === "object" &&
      record !== null &&
      typeof (record as SavedInvoiceRecord).id === "string" &&
      typeof (record as SavedInvoiceRecord).invoiceNumber === "string" &&
      typeof (record as SavedInvoiceRecord).status === "string" &&
      typeof (record as SavedInvoiceRecord).createdAt === "number" &&
      typeof (record as SavedInvoiceRecord).updatedAt === "number" &&
      typeof (record as SavedInvoiceRecord).data === "object"
    );
  });
};

const toRecord = (
  invoice: InvoiceType,
  status: InvoiceStatus,
  existing?: SavedInvoiceRecord
): SavedInvoiceRecord => {
  const now = Date.now();
  const invoiceNumber = invoice.details.invoiceNumber || `invoice-${now}`;

  return {
    id: existing?.id ?? createId(),
    invoiceNumber,
    status: existing?.status ?? status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    data: cloneInvoice(invoice),
  };
};

const sortByUpdatedAt = (records: SavedInvoiceRecord[]) => {
  return [...records].sort((a, b) => b.updatedAt - a.updatedAt);
};

const safeRead = (key: string) => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeWrite = (key: string, value: string) => {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const readLegacyInvoices = (): InvoiceType[] => {
  const raw = safeRead(LEGACY_SAVED_INVOICES_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InvoiceType[]) : [];
  } catch {
    return [];
  }
};

export const readSavedInvoices = (): SavedInvoiceRecord[] => {
  const raw = safeRead(SAVED_INVOICES_KEY_V2);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (isRecordArray(parsed)) {
        return sortByUpdatedAt(parsed);
      }
    } catch {
      // fallback to legacy migration
    }
  }

  const legacyInvoices = readLegacyInvoices();
  if (!legacyInvoices.length) return [];

  const migrated = sortByUpdatedAt(
    legacyInvoices.map((invoice) => toRecord(invoice, "draft"))
  );

  const persisted = safeWrite(SAVED_INVOICES_KEY_V2, JSON.stringify(migrated));
  return persisted ? migrated : migrated;
};

export const writeSavedInvoices = (records: SavedInvoiceRecord[]) => {
  return safeWrite(SAVED_INVOICES_KEY_V2, JSON.stringify(sortByUpdatedAt(records)));
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
      records.map((record) => (record.id === existing.id ? nextRecord : record))
    );

    return {
      nextRecords,
      record: nextRecord,
    };
  }

  const newRecord = toRecord(invoice, status);
  return {
    nextRecords: sortByUpdatedAt([newRecord, ...records]),
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

  const duplicatedInvoice = cloneInvoice(source.data);
  duplicatedInvoice.details.invoiceNumber = nextDuplicateInvoiceNumber(
    source.invoiceNumber,
    records
  );

  const duplicated = toRecord(duplicatedInvoice, "draft");
  return sortByUpdatedAt([duplicated, ...records]);
};

export const updateSavedInvoiceStatus = (
  records: SavedInvoiceRecord[],
  id: string,
  status: InvoiceStatus
) => {
  const now = Date.now();
  return sortByUpdatedAt(
    records.map((record) =>
      record.id === id
        ? {
            ...record,
            status,
            updatedAt: now,
          }
        : record
    )
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
