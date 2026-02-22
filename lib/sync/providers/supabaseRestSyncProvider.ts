import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { InvoiceSyncProvider, SyncProviderError } from "@/lib/sync/types";

type CreateSupabaseRestSyncProviderArgs = {};

const getAccessToken = async () => {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return null;
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) {
    throw new SyncProviderError("Unable to read Supabase session", {
      retryable: false,
    });
  }

  const existingSession = sessionData.session;
  if (existingSession?.access_token) {
    const expiresAtMs = (existingSession.expires_at || 0) * 1000;
    const refreshThresholdMs = Date.now() + 30_000;
    if (expiresAtMs > refreshThresholdMs) {
      return existingSession.access_token;
    }
  }

  const { data: refreshedData, error: refreshError } =
    await supabase.auth.refreshSession();
  if (refreshError) {
    return null;
  }

  return refreshedData.session?.access_token ?? null;
};

const toPayloadBytes = (snapshot: unknown) => {
  return new TextEncoder().encode(JSON.stringify(snapshot)).length;
};

export const createSupabaseRestSyncProvider = (
  _args: CreateSupabaseRestSyncProviderArgs
): InvoiceSyncProvider => {
  return {
    name: "supabase-rest",
    isCloudProvider: true,
    async pushSnapshot(snapshot, options) {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return {
          status: "skipped",
          provider: "supabase-rest",
          reason: "supabase_client_unavailable",
        };
      }

      const providedToken = options?.accessToken?.trim() || null;
      const accessToken = (await getAccessToken()) || providedToken;
      if (!accessToken) {
        return {
          status: "skipped",
          provider: "supabase-rest",
          reason: "unauthenticated_no_token",
        };
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(accessToken);

      if (userError || !user) {
        return {
          status: "skipped",
          provider: "supabase-rest",
          reason: "unauthenticated",
        };
      }

      const payloadBytes = toPayloadBytes(snapshot);
      const { error: upsertError } = await supabase
        .from("invoice_sync_snapshots")
        .upsert(
          {
            user_id: user.id,
            reason: snapshot.reason,
            snapshot_timestamp: snapshot.timestamp,
            saved_invoices: snapshot.savedInvoices,
            customer_templates: snapshot.customerTemplates,
            payload_bytes: payloadBytes,
          },
          {
            onConflict: "user_id",
          }
        );

      if (upsertError) {
        throw new SyncProviderError(`Supabase sync failed: ${upsertError.message}`, {
          retryable: false,
        });
      }

      return {
        status: "pushed",
        provider: "supabase-rest",
      };
    },
  };
};
