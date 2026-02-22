import { InvoiceSyncProvider } from "@/lib/sync/types";

export const localSyncProvider: InvoiceSyncProvider = {
  name: "local",
  isCloudProvider: false,
  async pushSnapshot() {
    // Local mode intentionally performs no external sync.
  },
};
