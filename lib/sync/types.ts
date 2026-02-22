import { CustomerTemplateRecord, SavedInvoiceRecord } from "@/types";

export type InvoiceSyncProviderName =
  | "local"
  | "noop-cloud"
  | "supabase-rest";

export type InvoiceSyncSnapshot = {
  reason: string;
  timestamp: number;
  savedInvoices: SavedInvoiceRecord[];
  customerTemplates: CustomerTemplateRecord[];
};

export type SyncPushResult =
  | {
      status: "pushed";
      provider: InvoiceSyncProviderName;
    }
  | {
      status: "skipped";
      provider: InvoiceSyncProviderName;
      reason: string;
    };

export class SyncProviderError extends Error {
  retryable: boolean;
  statusCode?: number;

  constructor(message: string, options?: { retryable?: boolean; statusCode?: number }) {
    super(message);
    this.name = "SyncProviderError";
    this.retryable = options?.retryable ?? false;
    this.statusCode = options?.statusCode;
  }
}

export interface InvoiceSyncProvider {
  name: InvoiceSyncProviderName;
  isCloudProvider: boolean;
  pushSnapshot: (snapshot: InvoiceSyncSnapshot) => Promise<SyncPushResult>;
}
