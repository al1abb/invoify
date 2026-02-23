import { localSyncProvider } from "@/lib/sync/providers/localSyncProvider";
import { noopCloudSyncProvider } from "@/lib/sync/providers/noopCloudSyncProvider";
import { createSupabaseRestSyncProvider } from "@/lib/sync/providers/supabaseRestSyncProvider";
import { getSyncRuntimeConfig } from "@/lib/sync/runtimeConfig";
import { trackClientEvent } from "@/lib/telemetry/clientTelemetry";
import { InvoiceSyncProvider } from "@/lib/sync/types";

export const createInvoiceSyncProvider = (): InvoiceSyncProvider => {
  const config = getSyncRuntimeConfig();
  const selectedProvider = config.provider;

  if (selectedProvider === "noop-cloud") {
    return noopCloudSyncProvider;
  }

  if (selectedProvider === "supabase-rest") {
    if (!config.supabaseUrl || !config.syncAnonKey) {
      trackClientEvent(
        "sync_provider_unavailable",
        {
          message:
            "supabase-rest selected but NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Falling back to noop-cloud.",
        },
        "warn"
      );
      return noopCloudSyncProvider;
    }

    return createSupabaseRestSyncProvider({
      supabaseUrl: config.supabaseUrl,
      anonKey: config.syncAnonKey,
    });
  }

  return localSyncProvider;
};
