"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

const AuthControls = () => {
  const {
    isSupabaseConfigured,
    isAuthenticated,
    userEmail,
    loading,
    authBusy,
    authError,
    clearAuthError,
    signIn,
    signUp,
    signOut,
  } = useAuthContext();

  const { _t } = useTranslationContext();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setOpen(false);
      setStatusMessage(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (open) return;
    setPassword("");
    clearAuthError();
  }, [clearAuthError, open]);

  const modeLabel = useMemo(() => {
    return mode === "signIn" ? _t("auth.signIn") : _t("auth.signUp");
  }, [mode, _t]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      return;
    }

    const ok =
      mode === "signIn"
        ? await signIn(normalizedEmail, password)
        : await signUp(normalizedEmail, password);

    if (!ok) return;

    if (mode === "signUp") {
      setStatusMessage(_t("auth.signUpSuccess"));
      return;
    }

    setOpen(false);
  };

  const onToggleMode = () => {
    setMode((current) => (current === "signIn" ? "signUp" : "signIn"));
    setStatusMessage(null);
    clearAuthError();
  };

  if (!isSupabaseConfigured) {
    return (
      <Button variant="outline" size="sm" disabled>
        {_t("auth.notConfigured")}
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="max-w-44 truncate text-xs text-muted-foreground">
          {userEmail}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void signOut();
          }}
          disabled={authBusy}
          data-testid="auth-signout-btn"
        >
          {_t("auth.signOut")}
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading} data-testid="auth-open-btn">
          {_t("auth.signIn")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{modeLabel}</DialogTitle>
          <DialogDescription>{_t("auth.dialogDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="auth-email">{_t("auth.email")}</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="auth-password">{_t("auth.password")}</Label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          {authError ? (
            <p className="text-sm text-destructive" data-testid="auth-error">
              {authError}
            </p>
          ) : null}

          {statusMessage ? (
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={authBusy || loading}
            data-testid="auth-submit-btn"
          >
            {modeLabel}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onToggleMode}
            disabled={authBusy}
            data-testid="auth-toggle-mode-btn"
          >
            {mode === "signIn" ? _t("auth.switchToSignUp") : _t("auth.switchToSignIn")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthControls;
