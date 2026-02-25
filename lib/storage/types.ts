import { CustomerTemplateRecord, InvoiceType, SavedInvoiceRecord } from "@/types";

export type DraftEnvelopeV2 = {
  version: 2;
  updatedAt: number;
  data: InvoiceType;
};

export type SavedInvoicesEnvelopeV3 = {
  version: 3;
  updatedAt: number;
  records: SavedInvoiceRecord[];
};

export type TemplatesEnvelopeV2 = {
  version: 2;
  updatedAt: number;
  records: CustomerTemplateRecord[];
};
