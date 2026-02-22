import { trackClientEvent } from "@/lib/telemetry/clientTelemetry";
import { InvoiceSyncProvider } from "@/lib/sync/types";

export const noopCloudSyncProvider: InvoiceSyncProvider = {
  name: "noop-cloud",
  isCloudProvider: true,
  async pushSnapshot(snapshot) {
    const reason = "cloud_provider_not_configured";
    trackClientEvent(
      "sync_provider_unavailable",
      {
        message:
          "No cloud sync provider is configured. Snapshot was kept local only.",
        skipReason: reason,
        reason: snapshot.reason,
        timestamp: snapshot.timestamp,
        savedInvoices: snapshot.savedInvoices.length,
        customerTemplates: snapshot.customerTemplates.length,
      },
      "warn"
    );

    return {
      status: "skipped",
      provider: "noop-cloud",
      reason,
    };
  },
};
