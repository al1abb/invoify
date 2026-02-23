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

export type SyncPushOptions = {
  accessToken?: string | null;
  timeoutMs?: number;
};

export type SyncPullOptions = {
  accessToken?: string | null;
  timeoutMs?: number;
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

export type SyncPullResult =
  | {
      status: "pulled";
      provider: InvoiceSyncProviderName;
      snapshot: InvoiceSyncSnapshot;
      remoteUpdatedAt: number | null;
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
  pushSnapshot: (
    snapshot: InvoiceSyncSnapshot,
    options?: SyncPushOptions
  ) => Promise<SyncPushResult>;
  pullSnapshot: (options?: SyncPullOptions) => Promise<SyncPullResult>;
}
