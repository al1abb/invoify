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
  const { syncStatus, syncConflicts } = useInvoiceContext();
  const { _t } = useTranslationContext();

  const hasConflicts = syncConflicts.length > 0;
  const effectiveState: SyncState = hasConflicts ? "skipped" : syncStatus.state;
  const reasonKey = hasConflicts
    ? "sync.reasons.conflict_detected"
    : syncStatus.reason
    ? `sync.reasons.${syncStatus.reason}`
    : "sync.reasons.none";

  return (
    <div className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{_t("sync.title")}</span>
        <Badge variant={toBadgeVariant(effectiveState)} data-testid="sync-status-badge">
          {_t(`sync.state.${effectiveState}`)}
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
        {hasConflicts ? (
          <span className="text-destructive">
            {_t("sync.conflicts.open")}: {syncConflicts.length}
          </span>
        ) : null}
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
