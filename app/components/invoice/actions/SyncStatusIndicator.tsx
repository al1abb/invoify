"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { SyncState } from "@/types";

const formatDateTime = (timestamp: number | null) => {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString();
};

const toBadgeVariant = (state: SyncState): "default" | "secondary" | "destructive" => {
  if (state === "success") return "default";
  if (state === "error") return "destructive";
  return "secondary";
};

const SyncStatusIndicator = () => {
  const { syncStatus } = useInvoiceContext();
  const { _t } = useTranslationContext();

  const reasonKey = syncStatus.reason
    ? `sync.reasons.${syncStatus.reason}`
    : "sync.reasons.none";

  return (
    <div className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{_t("sync.title")}</span>
        <Badge variant={toBadgeVariant(syncStatus.state)} data-testid="sync-status-badge">
          {_t(`sync.state.${syncStatus.state}`)}
        </Badge>
      </div>

      <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
        <span>
          {_t("sync.provider")}: {syncStatus.provider}
        </span>
        <span>
          {_t("sync.lastSuccess")}: {formatDateTime(syncStatus.lastSuccessAt)}
        </span>
        <span>
          {_t("sync.lastAttempt")}: {formatDateTime(syncStatus.lastAttemptAt)}
        </span>
        <span>
          {_t("sync.reason")}: {_t(reasonKey)}
        </span>
        {syncStatus.errorMessage ? (
          <span className="text-destructive">
            {_t("sync.error")}: {syncStatus.errorMessage}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default SyncStatusIndicator;
