"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Hooks
import useToasts from "@/hooks/useToasts";
import { useAuthContext } from "@/contexts/AuthContext";

// Services
import { exportInvoice } from "@/services/invoice/client/exportInvoice";

// Variables
import {
  FORM_DEFAULT_VALUES,
  LOCAL_STORAGE_INVOICE_DRAFT_KEY,
  SEND_PDF_API,
  SHORT_DATE_OPTIONS,
} from "@/lib/variables";

// Storage
import {
  addCustomerTemplate,
  findCustomerTemplate,
  readCustomerTemplates,
  renameCustomerTemplate as renameCustomerTemplateInRecords,
  removeCustomerTemplate,
  writeCustomerTemplates,
} from "@/lib/storage/customerTemplates";
import {
  cleanupPdfCache,
  getCachedPdf,
  listCachedPdfMetadata,
  upsertCachedPdf,
} from "@/lib/storage/pdfCache";
import {
  duplicateSavedInvoiceRecord,
  readSavedInvoices,
  removeSavedInvoiceRecord,
  upsertSavedInvoiceRecord,
  updateSavedInvoiceStatus as updateSavedInvoiceStatusInRecords,
  updateSavedInvoiceStatusByInvoiceNumber as updateSavedInvoiceStatusByInvoiceNumberInRecords,
  writeSavedInvoices,
} from "@/lib/storage/savedInvoices";

// Workers
import { generatePdfBlob } from "@/lib/workers/pdfGeneratorClient";

// Sync
import { createInvoiceSyncProvider } from "@/lib/sync/createInvoiceSyncProvider";
import { getSyncRuntimeConfig } from "@/lib/sync/runtimeConfig";
import {
  buildCappedSyncSnapshot,
  buildSyncSignature,
  toSnapshotPayloadSize,
} from "@/lib/sync/snapshot";
import { SyncProviderError } from "@/lib/sync/types";

// Telemetry
import {
  captureClientError,
  trackClientEvent,
} from "@/lib/telemetry/clientTelemetry";

// Types
import {
  CachedPdfMeta,
  CustomerTemplateRecord,
  ExportTypes,
  InvoiceStatus,
  InvoiceType,
  SavedInvoiceRecord,
  SyncStatus,
} from "@/types";

const defaultInvoiceContext = {
  invoicePdf: new Blob(),
  invoicePdfLoading: false,
  savedInvoices: [] as SavedInvoiceRecord[],
  customerTemplates: [] as CustomerTemplateRecord[],
  syncStatus: {
    state: "idle",
    provider: "local",
    lastAttemptAt: null,
    lastSuccessAt: null,
    reason: null,
    errorMessage: null,
  } as SyncStatus,
  pdfUrl: null as string | null,
  onFormSubmit: (_values: InvoiceType) => {},
  newInvoice: () => {},
  generatePdf: async (_data: InvoiceType) => {},
  removeFinalPdf: () => {},
  downloadPdf: () => {},
  printPdf: () => {},
  previewPdfInTab: () => {},
  saveInvoice: () => {},
  deleteInvoice: (_id: string) => {},
  duplicateInvoice: (_id: string) => {},
  updateSavedInvoiceStatus: (_id: string, _status: InvoiceStatus) => {},
  sendPdfToMail: (_email: string): Promise<void> => Promise.resolve(),
  exportInvoiceAs: (_exportAs: ExportTypes) => {},
  importInvoice: (_file: File) => {},
  restorePdfFromCache: async (_invoiceNumber: string) => false,
  getCachedPdfMeta: (_invoiceNumber: string) => null as CachedPdfMeta | null,
  hasCachedPdf: (_invoiceNumber: string) => false,
  saveCustomerTemplate: (_name: string) => {},
  applyCustomerTemplate: (_templateId: string) => false,
  renameCustomerTemplate: (_templateId: string, _name: string) => false,
  deleteCustomerTemplate: (_templateId: string) => {},
};

export const InvoiceContext = createContext(defaultInvoiceContext);

export const useInvoiceContext = () => {
  return useContext(InvoiceContext);
};

type InvoiceContextProviderProps = {
  children: React.ReactNode;
};

const toMetaMap = (items: CachedPdfMeta[]) => {
  return items.reduce<Record<string, CachedPdfMeta>>((acc, item) => {
    acc[item.invoiceNumber] = item;
    return acc;
  }, {});
};

const createInitialSyncStatus = (provider: SyncStatus["provider"]): SyncStatus => {
  return {
    state: "idle",
    provider,
    lastAttemptAt: null,
    lastSuccessAt: null,
    reason: null,
    errorMessage: null,
  };
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const toBackoffDelayMs = (baseDelayMs: number, attempt: number) => {
  const exponential = baseDelayMs * 2 ** (attempt - 1);
  const jitterMultiplier = 0.85 + Math.random() * 0.3;
  return Math.round(exponential * jitterMultiplier);
};

const SYNC_PUSH_TIMEOUT_MS = 8000;

export const InvoiceContextProvider = ({ children }: InvoiceContextProviderProps) => {
  // Toasts
  const {
    newInvoiceSuccess,
    pdfGenerationSuccess,
    saveInvoiceSuccess,
    modifiedInvoiceSuccess,
    sendPdfSuccess,
    sendPdfError,
    importInvoiceError,
  } = useToasts();

  // RHF values and methods
  const { getValues, reset, setValue, watch } = useFormContext<InvoiceType>();
  const { accessToken, isAuthenticated } = useAuthContext();

  // Variables
  const [invoicePdf, setInvoicePdf] = useState<Blob>(new Blob());
  const [invoicePdfLoading, setInvoicePdfLoading] = useState<boolean>(false);

  const [savedInvoices, setSavedInvoices] = useState<SavedInvoiceRecord[]>([]);
  const [customerTemplates, setCustomerTemplates] = useState<
    CustomerTemplateRecord[]
  >([]);
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);
  const [cachedPdfMetaByInvoiceNumber, setCachedPdfMetaByInvoiceNumber] =
    useState<Record<string, CachedPdfMeta>>({});

  const draftPersistTimeoutRef = useRef<number | null>(null);
  const syncTimeoutRef = useRef<number | null>(null);
  const syncInFlightRef = useRef(false);
  const syncQueuedRef = useRef(false);
  const lastSyncSignatureRef = useRef<string>("");
  const syncProvider = useMemo(() => createInvoiceSyncProvider(), []);
  const syncConfig = useMemo(() => getSyncRuntimeConfig(), []);
  const [syncScheduleVersion, setSyncScheduleVersion] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    createInitialSyncStatus(syncProvider.name)
  );

  const refreshCachedPdfMetadata = useCallback(async () => {
    try {
      const meta = await listCachedPdfMetadata();
      setCachedPdfMetaByInvoiceNumber(toMetaMap(meta));
    } catch {
      setCachedPdfMetaByInvoiceNumber({});
    }
  }, []);

  // Load local persisted state once
  useEffect(() => {
    try {
      setSavedInvoices(readSavedInvoices());
      setCustomerTemplates(readCustomerTemplates());
    } catch (error) {
      captureClientError("app_error", error, {
        area: "invoice_context_storage_hydrate",
      });
    }

    const hydratePdfCache = async () => {
      try {
        await cleanupPdfCache();
        await refreshCachedPdfMetadata();
      } catch (error) {
        setCachedPdfMetaByInvoiceNumber({});
        captureClientError("app_error", error, {
          area: "invoice_context_pdf_cache_hydrate",
        });
      } finally {
        setIsStorageHydrated(true);
      }
    };

    void hydratePdfCache();
  }, [refreshCachedPdfMetadata]);

  // Persist full form state with debounce
  useEffect(() => {
    if (typeof window === "undefined") return;

    const subscription = watch((value) => {
      if (draftPersistTimeoutRef.current) {
        window.clearTimeout(draftPersistTimeoutRef.current);
      }

      draftPersistTimeoutRef.current = window.setTimeout(() => {
        try {
          window.localStorage.setItem(
            LOCAL_STORAGE_INVOICE_DRAFT_KEY,
            JSON.stringify(value)
          );
        } catch {
          // no-op: local storage may be unavailable
        }
      }, 300);
    });

    return () => {
      subscription.unsubscribe();

      if (draftPersistTimeoutRef.current) {
        window.clearTimeout(draftPersistTimeoutRef.current);
      }
    };
  }, [watch]);

  // When the tab becomes visible again, schedule a sync attempt.
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

  // Optional sync interface layer (local by default, cloud-ready abstraction).
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
                errorMessage:
                  error instanceof Error ? error.message : "Sync failed",
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
    customerTemplates,
    accessToken,
    isAuthenticated,
    isStorageHydrated,
    savedInvoices,
    syncScheduleVersion,
    syncConfig,
    syncProvider,
  ]);

  // Keep an object URL in sync with blob state and always revoke previous URLs.
  const pdfUrl = useMemo(() => {
    if (typeof window === "undefined" || invoicePdf.size === 0) {
      return null;
    }

    return window.URL.createObjectURL(invoicePdf);
  }, [invoicePdf]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  /**
   * Handles form submission.
   */
  const onFormSubmit = (data: InvoiceType) => {
    generatePdf(data);
  };

  /**
   * Generate a clean invoice and clear draft/pdf state.
   */
  const newInvoice = () => {
    reset(FORM_DEFAULT_VALUES);
    setInvoicePdf(new Blob());

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(LOCAL_STORAGE_INVOICE_DRAFT_KEY);
      } catch {
        // no-op
      }
    }

    newInvoiceSuccess();
  };

  /**
   * Generate a PDF document based on the provided data.
   */
  const generatePdf = useCallback(
    async (data: InvoiceType) => {
      setInvoicePdfLoading(true);

      try {
        const result = await generatePdfBlob(data);
        setInvoicePdf(result);

        if (result.size > 0) {
          pdfGenerationSuccess();
          trackClientEvent("pdf_generate_success", {
            invoiceNumber: data.details.invoiceNumber,
            sizeBytes: result.size,
          });

          const invoiceNumber = data.details.invoiceNumber?.trim();
          if (invoiceNumber) {
            try {
              await upsertCachedPdf(invoiceNumber, result);
              await refreshCachedPdfMetadata();
            } catch (error) {
              captureClientError("pdf_cache_write_failure", error, {
                invoiceNumber,
              });
            }
          }
        }
      } catch (error) {
        console.error(error);
        captureClientError("pdf_generate_failure", error, {
          invoiceNumber: data.details.invoiceNumber,
        });
      } finally {
        setInvoicePdfLoading(false);
      }
    },
    [pdfGenerationSuccess, refreshCachedPdfMetadata]
  );

  /**
   * Removes the final PDF file and switches back to live preview.
   */
  const removeFinalPdf = () => {
    setInvoicePdf(new Blob());
  };

  /**
   * Opens the generated PDF in a new tab.
   */
  const previewPdfInTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  /**
   * Downloads the generated PDF.
   */
  const downloadPdf = () => {
    if (invoicePdf instanceof Blob && invoicePdf.size > 0) {
      const url = window.URL.createObjectURL(invoicePdf);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  /**
   * Prints the generated PDF.
   */
  const printPdf = () => {
    if (invoicePdf.size > 0) {
      const generatedPdfUrl = URL.createObjectURL(invoicePdf);
      const printWindow = window.open(generatedPdfUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          URL.revokeObjectURL(generatedPdfUrl);
        };
      }
    }
  };

  /**
   * Save/overwrite current invoice in browser storage.
   */
  const saveInvoice = () => {
    if (!invoicePdf || invoicePdf.size === 0) return;

    const formValues = JSON.parse(JSON.stringify(getValues())) as InvoiceType;
    formValues.details.updatedAt = new Date().toLocaleDateString(
      "en-US",
      SHORT_DATE_OPTIONS
    );

    const alreadyExists = savedInvoices.some(
      (record) => record.invoiceNumber === formValues.details.invoiceNumber
    );

    const { nextRecords } = upsertSavedInvoiceRecord(
      savedInvoices,
      formValues,
      "draft"
    );

    setSavedInvoices(nextRecords);
    const persisted = writeSavedInvoices(nextRecords);
    if (!persisted) {
      captureClientError(
        "app_error",
        new Error("Failed to persist saved invoices"),
        {
          action: "save_invoice",
        }
      );
    }

    if (alreadyExists) {
      modifiedInvoiceSuccess();
    } else {
      saveInvoiceSuccess();
    }
  };

  /**
   * Delete a saved invoice record.
   */
  const deleteInvoice = (id: string) => {
    const updatedInvoices = removeSavedInvoiceRecord(savedInvoices, id);
    setSavedInvoices(updatedInvoices);
    const persisted = writeSavedInvoices(updatedInvoices);
    if (!persisted) {
      captureClientError(
        "app_error",
        new Error("Failed to persist saved invoices"),
        {
          action: "delete_invoice",
        }
      );
    }
  };

  /**
   * Duplicate an existing saved invoice.
   */
  const duplicateInvoice = (id: string) => {
    const updatedInvoices = duplicateSavedInvoiceRecord(savedInvoices, id);
    setSavedInvoices(updatedInvoices);
    const persisted = writeSavedInvoices(updatedInvoices);
    if (!persisted) {
      captureClientError(
        "app_error",
        new Error("Failed to persist saved invoices"),
        {
          action: "duplicate_invoice",
        }
      );
    }
  };

  /**
   * Update a record status by id.
   */
  const updateSavedInvoiceStatus = (id: string, status: InvoiceStatus) => {
    const updatedInvoices = updateSavedInvoiceStatusInRecords(
      savedInvoices,
      id,
      status
    );

    setSavedInvoices(updatedInvoices);
    const persisted = writeSavedInvoices(updatedInvoices);
    if (!persisted) {
      captureClientError(
        "app_error",
        new Error("Failed to persist saved invoices"),
        {
          action: "update_status",
          status,
        }
      );
    }
  };

  /**
   * Try restoring a generated PDF from browser cache by invoice number.
   */
  const restorePdfFromCache = async (invoiceNumber: string) => {
    try {
      const cached = await getCachedPdf(invoiceNumber);
      if (!cached) return false;

      setInvoicePdf(cached.pdfBlob);

      try {
        await upsertCachedPdf(invoiceNumber, cached.pdfBlob);
        await refreshCachedPdfMetadata();
      } catch (error) {
        captureClientError("pdf_cache_write_failure", error, {
          invoiceNumber,
          source: "restore",
        });
      }

      return true;
    } catch (error) {
      captureClientError("pdf_cache_restore_failure", error, {
        invoiceNumber,
      });
      return false;
    }
  };

  const getCachedPdfMeta = (invoiceNumber: string) => {
    return cachedPdfMetaByInvoiceNumber[invoiceNumber] || null;
  };

  const hasCachedPdf = (invoiceNumber: string) => {
    return Boolean(cachedPdfMetaByInvoiceNumber[invoiceNumber]);
  };

  /**
   * Send generated PDF to recipient email.
   */
  const sendPdfToMail = (email: string) => {
    const invoiceNumber = getValues().details.invoiceNumber;

    const fd = new FormData();
    fd.append("email", email);
    fd.append("invoicePdf", invoicePdf, "invoice.pdf");
    fd.append("invoiceNumber", invoiceNumber);

    return fetch(SEND_PDF_API, {
      method: "POST",
      body: fd,
    })
      .then(async (res) => {
        if (res.ok) {
          sendPdfSuccess();
          trackClientEvent("email_send_success", {
            email,
            invoiceNumber,
          });

          if (invoiceNumber) {
            const updatedInvoices = updateSavedInvoiceStatusByInvoiceNumberInRecords(
              savedInvoices,
              invoiceNumber,
              "sent"
            );
            setSavedInvoices(updatedInvoices);
            const persisted = writeSavedInvoices(updatedInvoices);
            if (!persisted) {
              captureClientError(
                "app_error",
                new Error("Failed to persist saved invoices"),
                {
                  action: "email_status_update",
                  invoiceNumber,
                }
              );
            }
          }
        } else {
          const errorMessage = (await res.text()).trim();
          captureClientError(
            "email_send_failure",
            new Error(errorMessage || "Failed to send email"),
            {
              email,
              invoiceNumber,
              status: res.status,
            }
          );

          sendPdfError({
            email,
            sendPdfToMail,
            reason: errorMessage || "Failed to send email",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        captureClientError("email_send_failure", error, {
          email,
          invoiceNumber,
        });

        sendPdfError({
          email,
          sendPdfToMail,
          reason: error instanceof Error ? error.message : "Failed to send email",
        });
      });
  };

  /**
   * Export invoice using selected format.
   */
  const exportInvoiceAs = (exportAs: ExportTypes) => {
    const formValues = getValues();
    exportInvoice(exportAs, formValues);
  };

  /**
   * Import an invoice from JSON.
   */
  const importInvoice = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);

        if (importedData.details) {
          if (importedData.details.invoiceDate) {
            importedData.details.invoiceDate = new Date(
              importedData.details.invoiceDate
            );
          }

          if (importedData.details.dueDate) {
            importedData.details.dueDate = new Date(importedData.details.dueDate);
          }
        }

        reset(importedData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        captureClientError("invoice_import_failure", error, {
          fileName: file.name,
        });
        importInvoiceError();
      }
    };

    reader.onerror = (error) => {
      captureClientError("invoice_import_failure", error, {
        fileName: file.name,
      });
      importInvoiceError();
    };

    reader.readAsText(file);
  };

  /**
   * Save current sender/receiver as a reusable customer template.
   */
  const saveCustomerTemplate = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const formValues = getValues();
    const nextTemplates = addCustomerTemplate(
      customerTemplates,
      trimmedName,
      formValues.sender,
      formValues.receiver
    );

    setCustomerTemplates(nextTemplates);
    const persisted = writeCustomerTemplates(nextTemplates);
    if (!persisted) {
      captureClientError(
        "app_error",
        new Error("Failed to persist customer templates"),
        {
          action: "save_template",
        }
      );
    }
  };

  /**
   * Apply a customer template to sender/receiver fields.
   */
  const applyCustomerTemplate = (templateId: string) => {
    const template = findCustomerTemplate(customerTemplates, templateId);
    if (!template) return false;

    setValue("sender", template.sender, {
      shouldDirty: true,
    });

    setValue("receiver", template.receiver, {
      shouldDirty: true,
    });

    return true;
  };

  /**
   * Delete customer template by id.
   */
  const deleteCustomerTemplate = (templateId: string) => {
    const nextTemplates = removeCustomerTemplate(customerTemplates, templateId);
    setCustomerTemplates(nextTemplates);
    const persisted = writeCustomerTemplates(nextTemplates);
    if (!persisted) {
      captureClientError(
        "app_error",
        new Error("Failed to persist customer templates"),
        {
          action: "delete_template",
        }
      );
    }
  };

  /**
   * Rename customer template by id.
   */
  const renameCustomerTemplate = (templateId: string, name: string) => {
    const nextTemplates = renameCustomerTemplateInRecords(
      customerTemplates,
      templateId,
      name
    );

    if (nextTemplates === customerTemplates) {
      return false;
    }

    setCustomerTemplates(nextTemplates);
    const persisted = writeCustomerTemplates(nextTemplates);
    if (!persisted) {
      captureClientError(
        "app_error",
        new Error("Failed to persist customer templates"),
        {
          action: "rename_template",
        }
      );
    }
    return true;
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoicePdf,
        invoicePdfLoading,
        savedInvoices,
        customerTemplates,
        syncStatus,
        pdfUrl,
        onFormSubmit,
        newInvoice,
        generatePdf,
        removeFinalPdf,
        downloadPdf,
        printPdf,
        previewPdfInTab,
        saveInvoice,
        deleteInvoice,
        duplicateInvoice,
        updateSavedInvoiceStatus,
        sendPdfToMail,
        exportInvoiceAs,
        importInvoice,
        restorePdfFromCache,
        getCachedPdfMeta,
        hasCachedPdf,
        saveCustomerTemplate,
        applyCustomerTemplate,
        renameCustomerTemplate,
        deleteCustomerTemplate,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
