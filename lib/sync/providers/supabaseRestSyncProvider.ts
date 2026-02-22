import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  InvoiceSyncProvider,
  SyncProviderError,
} from "@/lib/sync/types";

type CreateSupabaseRestSyncProviderArgs = {
  ingestUrl: string;
  supabaseUrl: string;
  anonKey: string;
};

let browserSupabaseClient: SupabaseClient | null = null;

const getBrowserSupabaseClient = (supabaseUrl: string, anonKey: string) => {
  if (browserSupabaseClient) return browserSupabaseClient;

  browserSupabaseClient = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserSupabaseClient;
};

const isRetryableStatus = (status: number) => {
  return status === 408 || status === 429 || status >= 500;
};

export const createSupabaseRestSyncProvider = ({
  ingestUrl,
  supabaseUrl,
  anonKey,
}: CreateSupabaseRestSyncProviderArgs): InvoiceSyncProvider => {
  const supabase = getBrowserSupabaseClient(supabaseUrl, anonKey);

  return {
    name: "supabase-rest",
    isCloudProvider: true,
    async pushSnapshot(snapshot) {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw new SyncProviderError("Unable to read Supabase session", {
          retryable: false,
        });
      }

      const accessToken = data.session?.access_token;
      if (!accessToken) {
        return {
          status: "skipped",
          provider: "supabase-rest",
          reason: "unauthenticated",
        };
      }

      let response: Response;
      try {
        response = await fetch(ingestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(snapshot),
        });
      } catch {
        throw new SyncProviderError("Supabase sync request failed", {
          retryable: true,
        });
      }

      if (!response.ok) {
        let message = `Supabase sync failed (${response.status})`;

        try {
          const body = await response.json();
          if (body?.error && typeof body.error === "string") {
            message = `${message}: ${body.error}`;
          }
        } catch {
          // fall back to status-only message
        }

        throw new SyncProviderError(message, {
          retryable: isRetryableStatus(response.status),
          statusCode: response.status,
        });
      }

      return {
        status: "pushed",
        provider: "supabase-rest",
      };
    },
  };
};
