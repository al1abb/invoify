import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserSupabaseClient: SupabaseClient | null = null;

const getSupabaseStorageKey = (supabaseUrl: string) => {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    const projectRef = hostname.split(".")[0];
    if (!projectRef) return null;
    return `sb-${projectRef}-auth-token`;
  } catch {
    return null;
  }
};

const createSafeAuthStorage = (sessionStorageKey: string) => {
  return {
    getItem(key: string) {
      if (typeof window === "undefined") return null;

      try {
        const raw = window.localStorage.getItem(key);
        if (raw === null) return null;

        // Supabase expects valid JSON for the session key. Corrupted values can
        // throw SyntaxError in the SDK, so we discard bad data here.
        if (key === sessionStorageKey) {
          try {
            JSON.parse(raw);
          } catch {
            window.localStorage.removeItem(key);
            return null;
          }
        }

        return raw;
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string) {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // no-op
      }
    },
    removeItem(key: string) {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(key);
      } catch {
        // no-op
      }
    },
  };
};

const getSupabaseEnv = () => {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  };
};

export const isSupabaseBrowserConfigAvailable = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export const getSupabaseBrowserClient = (): SupabaseClient | null => {
  if (typeof window === "undefined") return null;

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (browserSupabaseClient) {
    return browserSupabaseClient;
  }

  const storageKey = getSupabaseStorageKey(supabaseUrl);

  browserSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      ...(storageKey
        ? {
            storageKey,
            storage: createSafeAuthStorage(storageKey),
          }
        : {}),
    },
  });

  return browserSupabaseClient;
};
