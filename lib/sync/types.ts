import { CustomerTemplateRecord, SavedInvoiceRecord } from "@/types";

export type InvoiceSyncProviderName = "local" | "noop-cloud";

export type InvoiceSyncSnapshot = {
  reason: string;
  timestamp: number;
  savedInvoices: SavedInvoiceRecord[];
  customerTemplates: CustomerTemplateRecord[];
};

export interface InvoiceSyncProvider {
  name: InvoiceSyncProviderName;
  isCloudProvider: boolean;
  pushSnapshot: (snapshot: InvoiceSyncSnapshot) => Promise<void>;
}
