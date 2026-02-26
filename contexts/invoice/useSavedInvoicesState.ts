import { useCallback, useEffect, useState } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

import {
  addCustomerTemplate,
  findCustomerTemplate,
  readCustomerTemplates,
  renameCustomerTemplate as renameCustomerTemplateInRecords,
  removeCustomerTemplate,
  writeCustomerTemplates,
} from "@/lib/storage/customerTemplates";
import {
  duplicateSavedInvoiceRecord,
  generateNextRecurringInvoice as generateNextRecurringInvoiceInRecords,
  markSavedInvoiceReminderSent as markSavedInvoiceReminderSentInRecords,
  readSavedInvoices,
  recordSavedInvoicePayment as recordSavedInvoicePaymentInRecords,
  removeSavedInvoiceRecord,
  setSavedInvoiceRecurring as setSavedInvoiceRecurringInRecords,
  upsertSavedInvoiceRecord,
  updateSavedInvoiceStatus as updateSavedInvoiceStatusInRecords,
  writeSavedInvoices,
} from "@/lib/storage/savedInvoices";
import { SHORT_DATE_OPTIONS } from "@/lib/variables";
import { captureClientError } from "@/lib/telemetry/clientTelemetry";
import {
  CustomerTemplateRecord,
  InvoiceStatus,
  InvoiceType,
  RecurringFrequency,
  SavedInvoiceRecord,
} from "@/types";

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

type UseSavedInvoicesStateArgs = {
  getValues: UseFormGetValues<InvoiceType>;
  setValue: UseFormSetValue<InvoiceType>;
  invoicePdf: Blob;
  saveInvoiceSuccess: () => void;
  modifiedInvoiceSuccess: () => void;
};

export const useSavedInvoicesState = ({
  getValues,
  setValue,
  invoicePdf,
  saveInvoiceSuccess,
  modifiedInvoiceSuccess,
}: UseSavedInvoicesStateArgs) => {
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoiceRecord[]>([]);
  const [customerTemplates, setCustomerTemplates] = useState<
    CustomerTemplateRecord[]
  >([]);
  const [isRecordsHydrated, setIsRecordsHydrated] = useState(false);

  const persistSavedInvoices = useCallback<PersistSavedInvoices>(
    (nextRecords, action, metadata) => {
      setSavedInvoices(nextRecords);
      const persisted = writeSavedInvoices(nextRecords);
      if (!persisted) {
        captureClientError(
          "app_error",
          new Error("Failed to persist saved invoices"),
          {
            action,
            ...(metadata || {}),
          }
        );
      }
    },
    []
  );

  const persistCustomerTemplates = useCallback<PersistCustomerTemplates>(
    (nextRecords, action, metadata) => {
      setCustomerTemplates(nextRecords);
      const persisted = writeCustomerTemplates(nextRecords);
      if (!persisted) {
        captureClientError(
          "app_error",
          new Error("Failed to persist customer templates"),
          {
            action,
            ...(metadata || {}),
          }
        );
      }
    },
    []
  );

  useEffect(() => {
    try {
      setSavedInvoices(readSavedInvoices());
      setCustomerTemplates(readCustomerTemplates());
    } catch (error) {
      captureClientError("app_error", error, {
        area: "invoice_context_storage_hydrate",
      });
    } finally {
      setIsRecordsHydrated(true);
    }
  }, []);

  const saveInvoice = useCallback(() => {
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

    persistSavedInvoices(nextRecords, "save_invoice");

    if (alreadyExists) {
      modifiedInvoiceSuccess();
    } else {
      saveInvoiceSuccess();
    }
  }, [
    getValues,
    invoicePdf,
    modifiedInvoiceSuccess,
    persistSavedInvoices,
    saveInvoiceSuccess,
    savedInvoices,
  ]);

  const deleteInvoice = useCallback(
    (id: string) => {
      const updatedInvoices = removeSavedInvoiceRecord(savedInvoices, id);
      persistSavedInvoices(updatedInvoices, "delete_invoice", { id });
    },
    [persistSavedInvoices, savedInvoices]
  );

  const duplicateInvoice = useCallback(
    (id: string) => {
      const updatedInvoices = duplicateSavedInvoiceRecord(savedInvoices, id);
      persistSavedInvoices(updatedInvoices, "duplicate_invoice", { id });
    },
    [persistSavedInvoices, savedInvoices]
  );

  const updateSavedInvoiceStatus = useCallback(
    (id: string, status: InvoiceStatus) => {
      const updatedInvoices = updateSavedInvoiceStatusInRecords(
        savedInvoices,
        id,
        status
      );

      persistSavedInvoices(updatedInvoices, "update_status", { id, status });
    },
    [persistSavedInvoices, savedInvoices]
  );

  const recordInvoicePayment = useCallback(
    (id: string, amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) return false;

      const hasTarget = savedInvoices.some((record) => record.id === id);
      if (!hasTarget) return false;

      const updatedInvoices = recordSavedInvoicePaymentInRecords(
        savedInvoices,
        id,
        amount
      );
      persistSavedInvoices(updatedInvoices, "record_payment", { id, amount });
      return true;
    },
    [persistSavedInvoices, savedInvoices]
  );

  const markInvoiceReminderSent = useCallback(
    (id: string) => {
      const hasTarget = savedInvoices.some((record) => record.id === id);
      if (!hasTarget) return false;

      const updatedInvoices = markSavedInvoiceReminderSentInRecords(savedInvoices, id);
      persistSavedInvoices(updatedInvoices, "mark_reminder_sent", { id });
      return true;
    },
    [persistSavedInvoices, savedInvoices]
  );

  const setInvoiceRecurring = useCallback(
    (id: string, frequency: RecurringFrequency | null) => {
      const hasTarget = savedInvoices.some((record) => record.id === id);
      if (!hasTarget) return false;

      const updatedInvoices = setSavedInvoiceRecurringInRecords(
        savedInvoices,
        id,
        frequency
      );
      persistSavedInvoices(updatedInvoices, "set_recurring", {
        id,
        frequency: frequency || "none",
      });
      return true;
    },
    [persistSavedInvoices, savedInvoices]
  );

  const generateRecurringInvoice = useCallback(
    (id: string) => {
      const updatedInvoices = generateNextRecurringInvoiceInRecords(savedInvoices, id);
      if (updatedInvoices === savedInvoices) return false;

      persistSavedInvoices(updatedInvoices, "generate_recurring_invoice", { id });
      return true;
    },
    [persistSavedInvoices, savedInvoices]
  );

  const saveCustomerTemplate = useCallback(
    (name: string) => {
      const trimmedName = name.trim();
      if (!trimmedName) return;

      const formValues = getValues();
      const nextTemplates = addCustomerTemplate(
        customerTemplates,
        trimmedName,
        formValues.sender,
        formValues.receiver
      );

      persistCustomerTemplates(nextTemplates, "save_template");
    },
    [customerTemplates, getValues, persistCustomerTemplates]
  );

  const applyCustomerTemplate = useCallback(
    (templateId: string) => {
      const template = findCustomerTemplate(customerTemplates, templateId);
      if (!template) return false;

      setValue("sender", template.sender, {
        shouldDirty: true,
      });

      setValue("receiver", template.receiver, {
        shouldDirty: true,
      });

      return true;
    },
    [customerTemplates, setValue]
  );

  const deleteCustomerTemplate = useCallback(
    (templateId: string) => {
      const nextTemplates = removeCustomerTemplate(customerTemplates, templateId);
      persistCustomerTemplates(nextTemplates, "delete_template", {
        templateId,
      });
    },
    [customerTemplates, persistCustomerTemplates]
  );

  const renameCustomerTemplate = useCallback(
    (templateId: string, name: string) => {
      const nextTemplates = renameCustomerTemplateInRecords(
        customerTemplates,
        templateId,
        name
      );

      if (nextTemplates === customerTemplates) {
        return false;
      }

      persistCustomerTemplates(nextTemplates, "rename_template", {
        templateId,
      });
      return true;
    },
    [customerTemplates, persistCustomerTemplates]
  );

  return {
    savedInvoices,
    customerTemplates,
    isRecordsHydrated,
    setSavedInvoices,
    setCustomerTemplates,
    persistSavedInvoices,
    persistCustomerTemplates,
    saveInvoice,
    deleteInvoice,
    duplicateInvoice,
    updateSavedInvoiceStatus,
    recordInvoicePayment,
    markInvoiceReminderSent,
    setInvoiceRecurring,
    generateRecurringInvoice,
    saveCustomerTemplate,
    applyCustomerTemplate,
    deleteCustomerTemplate,
    renameCustomerTemplate,
  };
};

export type UseSavedInvoicesStateReturn = ReturnType<typeof useSavedInvoicesState>;
