import { localSyncProvider } from "@/lib/sync/providers/localSyncProvider";
import { noopCloudSyncProvider } from "@/lib/sync/providers/noopCloudSyncProvider";
import { InvoiceSyncProvider } from "@/lib/sync/types";

export const createInvoiceSyncProvider = (): InvoiceSyncProvider => {
  const selectedProvider =
    process.env.NEXT_PUBLIC_INVOICE_SYNC_PROVIDER || "local";

  if (selectedProvider === "noop-cloud") {
    return noopCloudSyncProvider;
  }

  return localSyncProvider;
};
