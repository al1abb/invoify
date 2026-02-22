import { InvoiceSyncProvider } from "@/lib/sync/types";

type CreateSupabaseRestSyncProviderArgs = {
  ingestUrl: string;
  anonKey: string;
};

export const createSupabaseRestSyncProvider = ({
  ingestUrl,
  anonKey,
}: CreateSupabaseRestSyncProviderArgs): InvoiceSyncProvider => {
  return {
    name: "supabase-rest",
    isCloudProvider: true,
    async pushSnapshot(snapshot) {
      const response = await fetch(ingestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify(snapshot),
      });

      if (!response.ok) {
        throw new Error(`Supabase sync failed (${response.status})`);
      }
    },
  };
};
