import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserSupabaseClient: SupabaseClient | null = null;

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

  browserSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserSupabaseClient;
};
