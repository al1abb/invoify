"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { useAuthContext } from "@/contexts/AuthContext";
import {
  useInvoiceExportAndEmail,
} from "@/contexts/invoice/useInvoiceExportAndEmail";
import { useInvoicePdfActions } from "@/contexts/invoice/useInvoicePdfActions";
import { useSavedInvoicesState } from "@/contexts/invoice/useSavedInvoicesState";
import { useInvoiceSyncState } from "@/contexts/invoice/useInvoiceSyncState";
import useToasts from "@/hooks/useToasts";
import { writeInvoiceDraft } from "@/lib/storage/invoiceDraft";
import {
  CachedPdfMeta,
  CustomerTemplateRecord,
  EmailMessageOptions,
  ExportTypes,
  InvoiceStatus,
  InvoiceType,
  RecurringFrequency,
  SavedInvoiceRecord,
  SyncConflictChoice,
  SyncConflictSummary,
  SyncStatus,
} from "@/types";

const defaultInvoiceContext = {
  invoicePdf: new Blob(),
  invoicePdfLoading: false,
  savedInvoices: [] as SavedInvoiceRecord[],
  customerTemplates: [] as CustomerTemplateRecord[],
  syncConflicts: [] as SyncConflictSummary[],
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
  recordInvoicePayment: (_id: string, _amount: number) => false,
  markInvoiceReminderSent: (_id: string) => false,
  setInvoiceRecurring: (_id: string, _frequency: RecurringFrequency | null) =>
    false,
  generateRecurringInvoice: (_id: string) => false,
  sendPdfToMail: (
    _email: string,
    _messageOptions?: EmailMessageOptions
  ): Promise<void> => Promise.resolve(),
  exportInvoiceAs: (_exportAs: ExportTypes) => {},
  importInvoice: (_file: File) => {},
  restorePdfFromCache: async (_invoiceNumber: string) => false,
  getCachedPdfMeta: (_invoiceNumber: string) => null as CachedPdfMeta | null,
  hasCachedPdf: (_invoiceNumber: string) => false,
  saveCustomerTemplate: (_name: string) => {},
  applyCustomerTemplate: (_templateId: string) => false,
  renameCustomerTemplate: (_templateId: string, _name: string) => false,
  deleteCustomerTemplate: (_templateId: string) => {},
  resolveSyncConflict: (_conflictId: string, _choice: SyncConflictChoice) =>
    false,
  resolveSyncConflictsWithDefaults: () => 0,
};

export const InvoiceContext = createContext(defaultInvoiceContext);

type InvoiceContextValue = typeof defaultInvoiceContext;

type PdfViewerContextValue = Pick<InvoiceContextValue, "invoicePdf">;

type SavedInvoicesListContextValue = Pick<
  InvoiceContextValue,
  | "savedInvoices"
  | "onFormSubmit"
  | "deleteInvoice"
  | "duplicateInvoice"
  | "updateSavedInvoiceStatus"
  | "recordInvoicePayment"
  | "markInvoiceReminderSent"
  | "setInvoiceRecurring"
  | "generateRecurringInvoice"
  | "restorePdfFromCache"
  | "getCachedPdfMeta"
>;

const defaultPdfViewerContext: PdfViewerContextValue = {
  invoicePdf: defaultInvoiceContext.invoicePdf,
};

const defaultSavedInvoicesListContext: SavedInvoicesListContextValue = {
  savedInvoices: defaultInvoiceContext.savedInvoices,
  onFormSubmit: defaultInvoiceContext.onFormSubmit,
  deleteInvoice: defaultInvoiceContext.deleteInvoice,
  duplicateInvoice: defaultInvoiceContext.duplicateInvoice,
  updateSavedInvoiceStatus: defaultInvoiceContext.updateSavedInvoiceStatus,
  recordInvoicePayment: defaultInvoiceContext.recordInvoicePayment,
  markInvoiceReminderSent: defaultInvoiceContext.markInvoiceReminderSent,
  setInvoiceRecurring: defaultInvoiceContext.setInvoiceRecurring,
  generateRecurringInvoice: defaultInvoiceContext.generateRecurringInvoice,
  restorePdfFromCache: defaultInvoiceContext.restorePdfFromCache,
  getCachedPdfMeta: defaultInvoiceContext.getCachedPdfMeta,
};

const InvoicePdfViewerContext = createContext(defaultPdfViewerContext);
const SavedInvoicesListContext = createContext(defaultSavedInvoicesListContext);

export const useInvoiceContext = () => {
  return useContext(InvoiceContext);
};

export const useInvoicePdfViewerContext = () => {
  return useContext(InvoicePdfViewerContext);
};

export const useSavedInvoicesListContext = () => {
  return useContext(SavedInvoicesListContext);
};

type InvoiceContextProviderProps = {
  children: React.ReactNode;
};

export const InvoiceContextProvider = ({ children }: InvoiceContextProviderProps) => {
  const {
    newInvoiceSuccess,
    pdfGenerationSuccess,
    saveInvoiceSuccess,
    modifiedInvoiceSuccess,
    sendPdfSuccess,
    sendPdfError,
    importInvoiceError,
    exportInvoiceError,
  } = useToasts();

  const { getValues, reset, setValue, watch } = useFormContext<InvoiceType>();
  const { accessToken, isAuthenticated, user } = useAuthContext();

  const draftPersistTimeoutRef = useRef<number | null>(null);

  const pdfActions = useInvoicePdfActions({
    getValues,
    reset,
    newInvoiceSuccess,
    pdfGenerationSuccess,
  });

  const savedState = useSavedInvoicesState({
    getValues,
    setValue,
    invoicePdf: pdfActions.invoicePdf,
    saveInvoiceSuccess,
    modifiedInvoiceSuccess,
  });

  const isStorageHydrated =
    savedState.isRecordsHydrated && pdfActions.isPdfCacheHydrated;

  const syncState = useInvoiceSyncState({
    isStorageHydrated,
    savedInvoices: savedState.savedInvoices,
    customerTemplates: savedState.customerTemplates,
    persistSavedInvoices: savedState.persistSavedInvoices,
    persistCustomerTemplates: savedState.persistCustomerTemplates,
    accessToken,
    isAuthenticated,
    userId: user?.id || null,
  });

  const exportAndEmail = useInvoiceExportAndEmail({
    getValues,
    reset,
    invoicePdf: pdfActions.invoicePdf,
    savedInvoices: savedState.savedInvoices,
    persistSavedInvoices: savedState.persistSavedInvoices,
    resolvePdfFilenameMeta: pdfActions.resolvePdfFilenameMeta,
    sendPdfSuccess,
    sendPdfError,
    importInvoiceError,
    exportInvoiceError,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const subscription = watch((value) => {
      if (draftPersistTimeoutRef.current) {
        window.clearTimeout(draftPersistTimeoutRef.current);
      }

      draftPersistTimeoutRef.current = window.setTimeout(() => {
        writeInvoiceDraft(value);
      }, 300);
    });

    return () => {
      subscription.unsubscribe();

      if (draftPersistTimeoutRef.current) {
        window.clearTimeout(draftPersistTimeoutRef.current);
      }
    };
  }, [watch]);

  const contextValue = useMemo(
    () => ({
      invoicePdf: pdfActions.invoicePdf,
      invoicePdfLoading: pdfActions.invoicePdfLoading,
      savedInvoices: savedState.savedInvoices,
      customerTemplates: savedState.customerTemplates,
      syncConflicts: syncState.syncConflicts,
      syncStatus: syncState.syncStatus,
      pdfUrl: pdfActions.pdfUrl,
      onFormSubmit: pdfActions.onFormSubmit,
      newInvoice: pdfActions.newInvoice,
      generatePdf: pdfActions.generatePdf,
      removeFinalPdf: pdfActions.removeFinalPdf,
      downloadPdf: pdfActions.downloadPdf,
      printPdf: pdfActions.printPdf,
      previewPdfInTab: pdfActions.previewPdfInTab,
      saveInvoice: savedState.saveInvoice,
      deleteInvoice: savedState.deleteInvoice,
      duplicateInvoice: savedState.duplicateInvoice,
      updateSavedInvoiceStatus: savedState.updateSavedInvoiceStatus,
      recordInvoicePayment: savedState.recordInvoicePayment,
      markInvoiceReminderSent: savedState.markInvoiceReminderSent,
      setInvoiceRecurring: savedState.setInvoiceRecurring,
      generateRecurringInvoice: savedState.generateRecurringInvoice,
      sendPdfToMail: exportAndEmail.sendPdfToMail,
      exportInvoiceAs: exportAndEmail.exportInvoiceAs,
      importInvoice: exportAndEmail.importInvoice,
      restorePdfFromCache: pdfActions.restorePdfFromCache,
      getCachedPdfMeta: pdfActions.getCachedPdfMeta,
      hasCachedPdf: pdfActions.hasCachedPdf,
      saveCustomerTemplate: savedState.saveCustomerTemplate,
      applyCustomerTemplate: savedState.applyCustomerTemplate,
      renameCustomerTemplate: savedState.renameCustomerTemplate,
      deleteCustomerTemplate: savedState.deleteCustomerTemplate,
      resolveSyncConflict: syncState.resolveSyncConflict,
      resolveSyncConflictsWithDefaults: syncState.resolveSyncConflictsWithDefaults,
    }),
    [
      exportAndEmail.exportInvoiceAs,
      exportAndEmail.importInvoice,
      exportAndEmail.sendPdfToMail,
      pdfActions.downloadPdf,
      pdfActions.generatePdf,
      pdfActions.getCachedPdfMeta,
      pdfActions.hasCachedPdf,
      pdfActions.invoicePdf,
      pdfActions.invoicePdfLoading,
      pdfActions.newInvoice,
      pdfActions.onFormSubmit,
      pdfActions.pdfUrl,
      pdfActions.previewPdfInTab,
      pdfActions.printPdf,
      pdfActions.removeFinalPdf,
      pdfActions.restorePdfFromCache,
      savedState.applyCustomerTemplate,
      savedState.customerTemplates,
      savedState.deleteCustomerTemplate,
      savedState.deleteInvoice,
      savedState.duplicateInvoice,
      savedState.generateRecurringInvoice,
      savedState.markInvoiceReminderSent,
      savedState.recordInvoicePayment,
      savedState.renameCustomerTemplate,
      savedState.saveCustomerTemplate,
      savedState.saveInvoice,
      savedState.savedInvoices,
      savedState.setInvoiceRecurring,
      savedState.updateSavedInvoiceStatus,
      syncState.resolveSyncConflict,
      syncState.resolveSyncConflictsWithDefaults,
      syncState.syncConflicts,
      syncState.syncStatus,
    ]
  );

  const pdfViewerContextValue = useMemo(
    () => ({
      invoicePdf: pdfActions.invoicePdf,
    }),
    [pdfActions.invoicePdf]
  );

  const savedInvoicesListContextValue = useMemo(
    () => ({
      savedInvoices: savedState.savedInvoices,
      onFormSubmit: pdfActions.onFormSubmit,
      deleteInvoice: savedState.deleteInvoice,
      duplicateInvoice: savedState.duplicateInvoice,
      updateSavedInvoiceStatus: savedState.updateSavedInvoiceStatus,
      recordInvoicePayment: savedState.recordInvoicePayment,
      markInvoiceReminderSent: savedState.markInvoiceReminderSent,
      setInvoiceRecurring: savedState.setInvoiceRecurring,
      generateRecurringInvoice: savedState.generateRecurringInvoice,
      restorePdfFromCache: pdfActions.restorePdfFromCache,
      getCachedPdfMeta: pdfActions.getCachedPdfMeta,
    }),
    [
      pdfActions.getCachedPdfMeta,
      pdfActions.onFormSubmit,
      pdfActions.restorePdfFromCache,
      savedState.deleteInvoice,
      savedState.duplicateInvoice,
      savedState.generateRecurringInvoice,
      savedState.markInvoiceReminderSent,
      savedState.recordInvoicePayment,
      savedState.savedInvoices,
      savedState.setInvoiceRecurring,
      savedState.updateSavedInvoiceStatus,
    ]
  );

  return (
    <InvoiceContext.Provider value={contextValue}>
      <InvoicePdfViewerContext.Provider value={pdfViewerContextValue}>
        <SavedInvoicesListContext.Provider value={savedInvoicesListContextValue}>
          {children}
        </SavedInvoicesListContext.Provider>
      </InvoicePdfViewerContext.Provider>
    </InvoiceContext.Provider>
  );
};
