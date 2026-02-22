"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Session, User } from "@supabase/supabase-js";

import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigAvailable,
} from "@/lib/supabase/client";
import { captureClientError } from "@/lib/telemetry/clientTelemetry";

type AuthContextType = {
  isSupabaseConfigured: boolean;
  loading: boolean;
  authBusy: boolean;
  authError: string | null;
  session: Session | null;
  accessToken: string | null;
  user: User | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  clearAuthError: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

const defaultAuthContext: AuthContextType = {
  isSupabaseConfigured: false,
  loading: true,
  authBusy: false,
  authError: null,
  session: null,
  accessToken: null,
  user: null,
  userEmail: null,
  isAuthenticated: false,
  clearAuthError: () => undefined,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isSupabaseConfigured = useMemo(() => {
    return isSupabaseBrowserConfigAvailable();
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error) {
          setAuthError(error.message);
          captureClientError("app_error", error, {
            area: "supabase_auth_get_session",
          });
        }

        setSession(data.session ?? null);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setLoading(false);
      setAuthError(null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAuthError("Supabase is not configured.");
      return false;
    }

    setAuthBusy(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        captureClientError("app_error", error, {
          area: "supabase_auth_sign_in",
        });
        return false;
      }

      return true;
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAuthError("Supabase is not configured.");
      return false;
    }

    setAuthBusy(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        captureClientError("app_error", error, {
          area: "supabase_auth_sign_up",
        });
        return false;
      }

      return true;
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAuthError("Supabase is not configured.");
      return false;
    }

    setAuthBusy(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthError(error.message);
        captureClientError("app_error", error, {
          area: "supabase_auth_sign_out",
        });
        return false;
      }

      return true;
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const user = session?.user ?? null;

  const value = useMemo<AuthContextType>(() => {
    return {
      isSupabaseConfigured,
      loading,
      authBusy,
      authError,
      session,
      accessToken: session?.access_token ?? null,
      user,
      userEmail: user?.email ?? null,
      isAuthenticated: Boolean(user),
      clearAuthError,
      signIn,
      signUp,
      signOut,
    };
  }, [
    isSupabaseConfigured,
    loading,
    authBusy,
    authError,
    session,
    user,
    clearAuthError,
    signIn,
    signUp,
    signOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
