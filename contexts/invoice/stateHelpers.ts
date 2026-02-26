import {
  CustomerTemplateRecord,
  SavedInvoiceRecord,
  SyncStatus,
} from "@/types";

const byUpdatedAtDesc = <T extends { updatedAt: number }>(a: T, b: T) =>
  b.updatedAt - a.updatedAt;

const toSavedInvoiceKey = (record: SavedInvoiceRecord) => {
  const invoiceNumber = record.invoiceNumber?.trim();
  if (invoiceNumber) return invoiceNumber;

  return record.id;
};

export const replaceSavedInvoiceByKey = (
  records: SavedInvoiceRecord[],
  key: string,
  nextRecord: SavedInvoiceRecord
) => {
  const filtered = records.filter((record) => toSavedInvoiceKey(record) !== key);
  return [...filtered, nextRecord].sort(byUpdatedAtDesc);
};

export const replaceTemplateById = (
  records: CustomerTemplateRecord[],
  templateId: string,
  nextRecord: CustomerTemplateRecord
) => {
  const filtered = records.filter((record) => record.id !== templateId);
  return [...filtered, nextRecord].sort(byUpdatedAtDesc);
};

export const createInitialSyncStatus = (
  provider: SyncStatus["provider"]
): SyncStatus => {
  return {
    state: "idle",
    provider,
    lastAttemptAt: null,
    lastSuccessAt: null,
    reason: null,
    errorMessage: null,
  };
};
