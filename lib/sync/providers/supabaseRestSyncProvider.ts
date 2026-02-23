import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { InvoiceSyncProvider, SyncProviderError } from "@/lib/sync/types";

type CreateSupabaseRestSyncProviderArgs = {
  supabaseUrl: string;
  anonKey: string;
};

const DEFAULT_SYNC_TIMEOUT_MS = 8000;

const isRetryableStatus = (status: number) => {
  return status === 408 || status === 429 || status >= 500;
};

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

const buildUpsertBody = (
  userId: string,
  snapshot: Parameters<InvoiceSyncProvider["pushSnapshot"]>[0]
) => {
  const payloadBytes = new TextEncoder().encode(JSON.stringify(snapshot)).length;

  return {
    user_id: userId,
    reason: snapshot.reason,
    snapshot_timestamp: snapshot.timestamp,
    saved_invoices: snapshot.savedInvoices,
    customer_templates: snapshot.customerTemplates,
    payload_bytes: payloadBytes,
  };
};

const toResponseMessage = async (response: Response, prefix: string) => {
  try {
    const asJson = (await response.json()) as { message?: string; error?: string };
    if (asJson?.message) return `${prefix}: ${asJson.message}`;
    if (asJson?.error) return `${prefix}: ${asJson.error}`;
  } catch {
    // ignore JSON parse errors
  }

  try {
    const asText = await response.text();
    if (asText) return `${prefix}: ${asText.slice(0, 200)}`;
  } catch {
    // ignore text parse errors
  }

  return prefix;
};

export const createSupabaseRestSyncProvider = ({
  supabaseUrl,
  anonKey,
}: CreateSupabaseRestSyncProviderArgs): InvoiceSyncProvider => {
  const restEndpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/invoice_sync_snapshots?on_conflict=user_id`;

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

      const timeoutMs = Math.max(1000, options?.timeoutMs ?? DEFAULT_SYNC_TIMEOUT_MS);
      const abortController = new AbortController();
      const timeoutId = window.setTimeout(() => {
        abortController.abort();
      }, timeoutMs);

      let response: Response;
      try {
        response = await fetch(restEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
            Authorization: `Bearer ${accessToken}`,
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify(buildUpsertBody(user.id, snapshot)),
          signal: abortController.signal,
        });
      } catch (error) {
        window.clearTimeout(timeoutId);

        const isAbort =
          error instanceof DOMException && error.name === "AbortError";
        if (isAbort) {
          throw new SyncProviderError("Supabase sync timed out", {
            retryable: true,
            statusCode: 408,
          });
        }

        throw new SyncProviderError("Supabase sync request failed", {
          retryable: true,
        });
      }

      window.clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return {
            status: "skipped",
            provider: "supabase-rest",
            reason: "auth_rejected",
          };
        }

        const message = await toResponseMessage(
          response,
          `Supabase sync failed (${response.status})`
        );

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
