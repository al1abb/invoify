import { InvoiceSyncSnapshot } from "@/lib/sync/types";
import { CustomerTemplateRecord, SavedInvoiceRecord } from "@/types";

type BuildSnapshotOptions = {
  reason: string;
  savedInvoices: SavedInvoiceRecord[];
  customerTemplates: CustomerTemplateRecord[];
  maxInvoices: number;
  maxTemplates: number;
};

const byUpdatedDesc = <T extends { updatedAt: number }>(a: T, b: T) =>
  b.updatedAt - a.updatedAt;

export const buildCappedSyncSnapshot = ({
  reason,
  savedInvoices,
  customerTemplates,
  maxInvoices,
  maxTemplates,
}: BuildSnapshotOptions): InvoiceSyncSnapshot => {
  const cappedInvoices = [...savedInvoices]
    .sort(byUpdatedDesc)
    .slice(0, maxInvoices);

  const cappedTemplates = [...customerTemplates]
    .sort(byUpdatedDesc)
    .slice(0, maxTemplates);

  return {
    reason,
    timestamp: Date.now(),
    savedInvoices: cappedInvoices,
    customerTemplates: cappedTemplates,
  };
};

const hashInvoices = (records: SavedInvoiceRecord[]) =>
  records.map((record) => ({
    id: record.id,
    invoiceNumber: record.invoiceNumber,
    status: record.status,
    updatedAt: record.updatedAt,
  }));

const hashTemplates = (records: CustomerTemplateRecord[]) =>
  records.map((record) => ({
    id: record.id,
    name: record.name,
    updatedAt: record.updatedAt,
  }));

export const buildSyncSignature = (snapshot: InvoiceSyncSnapshot) => {
  return JSON.stringify({
    savedInvoices: hashInvoices(snapshot.savedInvoices),
    customerTemplates: hashTemplates(snapshot.customerTemplates),
  });
};

export const toSnapshotPayloadSize = (snapshot: InvoiceSyncSnapshot) => {
  return new TextEncoder().encode(JSON.stringify(snapshot)).length;
};
