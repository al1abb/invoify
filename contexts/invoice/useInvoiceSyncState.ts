import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createInvoiceSyncProvider } from "@/lib/sync/createInvoiceSyncProvider";
import {
  mergeRemoteSnapshotWithLocal,
  SyncConflictRecord,
  toSyncConflictSummaries,
} from "@/lib/sync/merge";
import { getSyncRuntimeConfig } from "@/lib/sync/runtimeConfig";
import {
  buildCappedSyncSnapshot,
  buildSyncSignature,
  toSnapshotPayloadSize,
} from "@/lib/sync/snapshot";
import { SyncProviderError } from "@/lib/sync/types";
import {
  captureClientError,
  trackClientEvent,
} from "@/lib/telemetry/clientTelemetry";
import {
  CustomerTemplateRecord,
  SavedInvoiceRecord,
  SyncConflictChoice,
  SyncConflictSummary,
  SyncStatus,
} from "@/types";

import {
  createInitialSyncStatus,
  replaceSavedInvoiceByKey,
  replaceTemplateById,
} from "@/contexts/invoice/stateHelpers";

const SYNC_PUSH_TIMEOUT_MS = 8000;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const toBackoffDelayMs = (baseDelayMs: number, attempt: number) => {
  const exponential = baseDelayMs * 2 ** (attempt - 1);
  const jitterMultiplier = 0.85 + Math.random() * 0.3;
  return Math.round(exponential * jitterMultiplier);
};

type PersistSavedInvoices = (
  nextRecords: SavedInvoiceRecord[],
  action: string,
  metadata?: Record<string, unknown>
) => void;

type PersistCustomerTemplates = (
  nextRecords: CustomerTemplateRecord[],
  action: string,
  metadata?: Record<string, unknown>
) => void;

type UseInvoiceSyncStateArgs = {
  isStorageHydrated: boolean;
  savedInvoices: SavedInvoiceRecord[];
  customerTemplates: CustomerTemplateRecord[];
  persistSavedInvoices: PersistSavedInvoices;
  persistCustomerTemplates: PersistCustomerTemplates;
  accessToken: string | null;
  isAuthenticated: boolean;
  userId: string | null;
};

export const useInvoiceSyncState = ({
  isStorageHydrated,
  savedInvoices,
  customerTemplates,
  persistSavedInvoices,
  persistCustomerTemplates,
  accessToken,
  isAuthenticated,
  userId,
}: UseInvoiceSyncStateArgs) => {
  const syncTimeoutRef = useRef<number | null>(null);
  const syncInFlightRef = useRef(false);
  const syncQueuedRef = useRef(false);
  const lastSyncSignatureRef = useRef<string>("");
  const syncConflictRef = useRef<SyncConflictRecord[]>([]);
  const lastPulledUserIdRef = useRef<string | null>(null);

  const syncProvider = useMemo(() => createInvoiceSyncProvider(), []);
  const syncConfig = useMemo(() => getSyncRuntimeConfig(), []);

  const [syncScheduleVersion, setSyncScheduleVersion] = useState(0);
  const [syncConflicts, setSyncConflicts] = useState<SyncConflictSummary[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    createInitialSyncStatus(syncProvider.name)
  );

  const updateConflictState = useCallback((conflicts: SyncConflictRecord[]) => {
    syncConflictRef.current = conflicts;
    setSyncConflicts(toSyncConflictSummaries(conflicts));
  }, []);

  const resolveSyncConflict = useCallback(
    (conflictId: string, choice: SyncConflictChoice) => {
      const conflict = syncConflictRef.current.find((item) => item.id === conflictId);
      if (!conflict) return false;

      if (conflict.entityType === "invoice") {
        const selected =
          choice === "local" ? conflict.localVersion : conflict.cloudVersion;
        const nextInvoices = replaceSavedInvoiceByKey(
          savedInvoices,
          conflict.key,
          selected
        );

        persistSavedInvoices(nextInvoices, "resolve_sync_conflict", {
          entityType: conflict.entityType,
        });
      } else {
        const selected =
          choice === "local" ? conflict.localVersion : conflict.cloudVersion;
        const nextTemplates = replaceTemplateById(
          customerTemplates,
          conflict.key,
          selected
        );

        persistCustomerTemplates(nextTemplates, "resolve_sync_conflict", {
          entityType: conflict.entityType,
        });
      }

      const remaining = syncConflictRef.current.filter(
        (item) => item.id !== conflictId
      );
      updateConflictState(remaining);

      if (remaining.length === 0) {
        setSyncStatus((prev) => ({
          ...prev,
          reason: null,
        }));
      }

      trackClientEvent("sync_conflict_resolved", {
        conflictId,
        entityType: conflict.entityType,
        choice,
        remaining: remaining.length,
      });

      return true;
    },
    [
      customerTemplates,
      persistCustomerTemplates,
      persistSavedInvoices,
      savedInvoices,
      updateConflictState,
    ]
  );

  const resolveSyncConflictsWithDefaults = useCallback(() => {
    const conflicts = syncConflictRef.current;
    if (conflicts.length === 0) return 0;

    let nextInvoices = savedInvoices;
    let nextTemplates = customerTemplates;

    for (const conflict of conflicts) {
      if (conflict.entityType === "invoice") {
        const selected =
          conflict.defaultChoice === "local"
            ? conflict.localVersion
            : conflict.cloudVersion;
        nextInvoices = replaceSavedInvoiceByKey(
          nextInvoices,
          conflict.key,
          selected
        );
      } else {
        const selected =
          conflict.defaultChoice === "local"
            ? conflict.localVersion
            : conflict.cloudVersion;
        nextTemplates = replaceTemplateById(
          nextTemplates,
          conflict.key,
          selected
        );
      }
    }

    persistSavedInvoices(nextInvoices, "resolve_sync_conflicts_defaults");
    persistCustomerTemplates(nextTemplates, "resolve_sync_conflicts_defaults");
    updateConflictState([]);

    setSyncStatus((prev) => ({
      ...prev,
      reason: null,
    }));

    trackClientEvent("sync_conflict_resolved", {
      strategy: "defaults",
      totalResolved: conflicts.length,
    });

    return conflicts.length;
  }, [
    customerTemplates,
    persistCustomerTemplates,
    persistSavedInvoices,
    savedInvoices,
    updateConflictState,
  ]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setSyncScheduleVersion((version) => version + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isStorageHydrated) return;
    if (!syncProvider.isCloudProvider) return;

    if (!isAuthenticated || !userId) {
      lastPulledUserIdRef.current = null;
      updateConflictState([]);
      return;
    }

    if (lastPulledUserIdRef.current === userId) {
      return;
    }

    let isCancelled = false;

    const pullSnapshotOnAuth = async () => {
      const startedAt = Date.now();
      setSyncStatus((prev) => ({
        ...prev,
        state: "syncing",
        provider: syncProvider.name,
        lastAttemptAt: startedAt,
        reason: "pull_on_login",
        errorMessage: null,
      }));

      try {
        const result = await syncProvider.pullSnapshot({
          accessToken,
          timeoutMs: SYNC_PUSH_TIMEOUT_MS,
        });

        if (isCancelled) return;

        if (result.status === "skipped") {
          lastPulledUserIdRef.current = userId;

          if (result.reason === "remote_snapshot_missing") {
            const syncedAt = Date.now();
            setSyncStatus((prev) => ({
              ...prev,
              state: "success",
              provider: result.provider,
              lastAttemptAt: syncedAt,
              lastSuccessAt: syncedAt,
              reason: syncConflictRef.current.length > 0 ? "conflict_detected" : null,
              errorMessage: null,
            }));

            trackClientEvent("sync_pull_success", {
              provider: result.provider,
              reason: result.reason,
              mergedSavedInvoices: savedInvoices.length,
              mergedCustomerTemplates: customerTemplates.length,
              conflicts: 0,
            });
            return;
          }

          setSyncStatus((prev) => ({
            ...prev,
            state: "skipped",
            provider: result.provider,
            lastAttemptAt: Date.now(),
            reason: result.reason,
            errorMessage: null,
          }));

          trackClientEvent(
            "sync_pull_skipped",
            {
              provider: result.provider,
              reason: result.reason,
            },
            "warn"
          );

          return;
        }

        const mergedResult = mergeRemoteSnapshotWithLocal({
          localSavedInvoices: savedInvoices,
          remoteSavedInvoices: result.snapshot.savedInvoices,
          localCustomerTemplates: customerTemplates,
          remoteCustomerTemplates: result.snapshot.customerTemplates,
        });

        persistSavedInvoices(mergedResult.savedInvoices, "sync_pull_merge");
        persistCustomerTemplates(
          mergedResult.customerTemplates,
          "sync_pull_merge"
        );

        updateConflictState(mergedResult.conflicts);
        lastSyncSignatureRef.current = "";
        lastPulledUserIdRef.current = userId;

        const syncedAt = Date.now();
        setSyncStatus((prev) => ({
          ...prev,
          state: "success",
          provider: result.provider,
          lastAttemptAt: syncedAt,
          lastSuccessAt: syncedAt,
          reason: mergedResult.conflicts.length > 0 ? "conflict_detected" : null,
          errorMessage: null,
        }));

        trackClientEvent("sync_pull_success", {
          provider: result.provider,
          remoteUpdatedAt: result.remoteUpdatedAt,
          mergedSavedInvoices: mergedResult.savedInvoices.length,
          mergedCustomerTemplates: mergedResult.customerTemplates.length,
          conflicts: mergedResult.conflicts.length,
        });

        if (mergedResult.conflicts.length > 0) {
          trackClientEvent(
            "sync_conflict_detected",
            {
              provider: result.provider,
              conflicts: mergedResult.conflicts.length,
            },
            "warn"
          );
        }

        setSyncScheduleVersion((version) => version + 1);
      } catch (error) {
        if (isCancelled) return;

        captureClientError("sync_pull_failure", error, {
          provider: syncProvider.name,
        });

        setSyncStatus((prev) => ({
          ...prev,
          state: "error",
          provider: syncProvider.name,
          lastAttemptAt: Date.now(),
          reason: null,
          errorMessage:
            error instanceof Error ? error.message : "Failed to pull sync snapshot",
        }));
      }
    };

    void pullSnapshotOnAuth();

    return () => {
      isCancelled = true;
    };
  }, [
    accessToken,
    customerTemplates,
    isAuthenticated,
    isStorageHydrated,
    persistCustomerTemplates,
    persistSavedInvoices,
    savedInvoices,
    syncProvider,
    updateConflictState,
    userId,
  ]);

  useEffect(() => {
    if (!isStorageHydrated) return;

    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = window.setTimeout(async () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        const skippedAt = Date.now();
        setSyncStatus((prev) => ({
          ...prev,
          state: "skipped",
          provider: syncProvider.name,
          lastAttemptAt: skippedAt,
          reason: "tab_hidden",
          errorMessage: null,
        }));
        return;
      }

      if (syncInFlightRef.current) {
        syncQueuedRef.current = true;
        return;
      }

      syncInFlightRef.current = true;

      try {
        const snapshot = buildCappedSyncSnapshot({
          reason: "state_change",
          savedInvoices,
          customerTemplates,
          maxInvoices: syncConfig.maxInvoices,
          maxTemplates: syncConfig.maxTemplates,
        });

        const signature = buildSyncSignature(snapshot);
        if (signature === lastSyncSignatureRef.current) {
          return;
        }

        const payloadBytes = toSnapshotPayloadSize(snapshot);
        if (payloadBytes > syncConfig.maxPayloadBytes) {
          const skippedAt = Date.now();
          setSyncStatus((prev) => ({
            ...prev,
            state: "skipped",
            provider: syncProvider.name,
            lastAttemptAt: skippedAt,
            reason: "payload_too_large",
            errorMessage: null,
          }));

          trackClientEvent(
            "sync_snapshot_skipped",
            {
              provider: syncProvider.name,
              payloadBytes,
              maxPayloadBytes: syncConfig.maxPayloadBytes,
            },
            "warn"
          );
          return;
        }

        const maxAttempts = syncProvider.isCloudProvider
          ? Math.max(1, syncConfig.retryMaxAttempts)
          : 1;
        const startedAt = Date.now();
        setSyncStatus((prev) => ({
          ...prev,
          state: "syncing",
          provider: syncProvider.name,
          lastAttemptAt: startedAt,
          reason: null,
          errorMessage: null,
        }));

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          try {
            const result = await syncProvider.pushSnapshot(snapshot, {
              accessToken,
              timeoutMs: SYNC_PUSH_TIMEOUT_MS,
            });
            if (result.status === "skipped") {
              const skippedAt = Date.now();
              setSyncStatus((prev) => ({
                ...prev,
                state: "skipped",
                provider: result.provider,
                lastAttemptAt: skippedAt,
                reason: result.reason,
                errorMessage: null,
              }));

              const unauthenticatedReasons = new Set([
                "unauthenticated",
                "unauthenticated_no_token",
                "auth_rejected",
                "function_unauthorized",
              ]);

              trackClientEvent(
                unauthenticatedReasons.has(result.reason)
                  ? "sync_push_skipped_unauthenticated"
                  : "sync_push_skipped",
                {
                  provider: result.provider,
                  reason: result.reason,
                  attempt,
                  maxAttempts,
                  payloadBytes,
                  savedInvoices: snapshot.savedInvoices.length,
                  customerTemplates: snapshot.customerTemplates.length,
                },
                unauthenticatedReasons.has(result.reason) ? "warn" : "info"
              );
              return;
            }

            lastSyncSignatureRef.current = signature;
            const syncedAt = Date.now();
            setSyncStatus((prev) => ({
              ...prev,
              state: "success",
              provider: result.provider,
              lastAttemptAt: syncedAt,
              lastSuccessAt: syncedAt,
              reason: null,
              errorMessage: null,
            }));

            trackClientEvent("sync_push_success", {
              provider: result.provider,
              payloadBytes,
              attempt,
              maxAttempts,
              savedInvoices: snapshot.savedInvoices.length,
              customerTemplates: snapshot.customerTemplates.length,
            });
            return;
          } catch (error) {
            const retryable =
              error instanceof SyncProviderError ? error.retryable : true;
            const statusCode =
              error instanceof SyncProviderError ? error.statusCode : undefined;
            const willRetry = retryable && attempt < maxAttempts;

            captureClientError("sync_push_failure", error, {
              provider: syncProvider.name,
              payloadBytes,
              attempt,
              maxAttempts,
              retryable,
              willRetry,
              statusCode,
              savedInvoices: snapshot.savedInvoices.length,
              customerTemplates: snapshot.customerTemplates.length,
            });

            if (!willRetry) {
              const failedAt = Date.now();
              setSyncStatus((prev) => ({
                ...prev,
                state: "error",
                provider: syncProvider.name,
                lastAttemptAt: failedAt,
                reason: null,
                errorMessage: error instanceof Error ? error.message : "Sync failed",
              }));
              return;
            }

            const delayMs = toBackoffDelayMs(syncConfig.retryBaseDelayMs, attempt);
            trackClientEvent(
              "sync_push_retry",
              {
                provider: syncProvider.name,
                attempt,
                nextAttempt: attempt + 1,
                maxAttempts,
                delayMs,
                statusCode,
              },
              "warn"
            );

            await sleep(delayMs);
          }
        }
      } finally {
        syncInFlightRef.current = false;
        if (syncQueuedRef.current) {
          syncQueuedRef.current = false;
          setSyncScheduleVersion((version) => version + 1);
        }
      }
    }, syncConfig.debounceMs);

    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [
    accessToken,
    customerTemplates,
    isStorageHydrated,
    savedInvoices,
    syncConfig,
    syncProvider,
    syncScheduleVersion,
  ]);

  return {
    syncConflicts,
    syncStatus,
    resolveSyncConflict,
    resolveSyncConflictsWithDefaults,
  };
};
