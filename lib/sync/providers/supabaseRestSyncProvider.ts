import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  InvoiceSyncProvider,
  SyncProviderError,
} from "@/lib/sync/types";

type CreateSupabaseRestSyncProviderArgs = {
  ingestUrl: string;
};

const isRetryableStatus = (status: number) => {
  return status === 408 || status === 429 || status >= 500;
};

const getFunctionNameFromIngestUrl = (ingestUrl: string) => {
  try {
    const parsedUrl = new URL(ingestUrl);
    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "invoice-sync";
  } catch {
    return "invoice-sync";
  }
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

  if (sessionData.session?.access_token) {
    return sessionData.session.access_token;
  }

  const { data: refreshedData, error: refreshError } =
    await supabase.auth.refreshSession();
  if (refreshError) {
    return null;
  }

  return refreshedData.session?.access_token ?? null;
};

export const createSupabaseRestSyncProvider = ({
  ingestUrl,
}: CreateSupabaseRestSyncProviderArgs): InvoiceSyncProvider => {
  const functionName = getFunctionNameFromIngestUrl(ingestUrl);

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

      const providedToken = options?.accessToken?.trim();
      const accessToken = providedToken || (await getAccessToken());
      if (!accessToken) {
        return {
          status: "skipped",
          provider: "supabase-rest",
          reason: "unauthenticated_no_token",
        };
      }

      supabase.functions.setAuth(accessToken);

      const { error, response } = await supabase.functions.invoke(functionName, {
        body: snapshot,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) {
        const statusCode = response?.status;
        if (statusCode === 401 || statusCode === 403) {
          return {
            status: "skipped",
            provider: "supabase-rest",
            reason: "function_unauthorized",
          };
        }

        const baseMessage = statusCode
          ? `Supabase sync failed (${statusCode})`
          : "Supabase sync failed";
        const message = error.message
          ? `${baseMessage}: ${error.message}`
          : baseMessage;

        throw new SyncProviderError(message, {
          retryable: statusCode ? isRetryableStatus(statusCode) : true,
          statusCode,
        });
      }

      return {
        status: "pushed",
        provider: "supabase-rest",
      };
    },
  };
};
