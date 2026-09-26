"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

// Next Intl
import { useLocale } from "next-intl";

// RHF
import { useFormContext } from "react-hook-form";

// Hooks
import useToasts from "@/hooks/useToasts";

// Services
import { exportInvoice } from "@/services/invoice/client/exportInvoice";

// Validation
import { InvoiceSchema } from "@/lib/schemas";

// Helpers
import { nextInvoiceNumber } from "@/lib/invoiceNumber";

// Variables
import {
  FORM_DEFAULT_VALUES,
  GENERATE_PDF_API,
  SEND_PDF_API,
  SHORT_DATE_OPTIONS,
  LOCAL_STORAGE_INVOICE_DRAFT_KEY,
  DRAFT_SAVE_DEBOUNCE_MS,
  WARM_BROWSER_API,
} from "@/lib/variables";

// Storage
import { readSecure, removeSecure, writeSecure } from "@/lib/secureStore";

// Types
import { ExportTypes, InvoiceType } from "@/types";

/**
 * Unprefixed, unlike the newer invoify: keys — this one predates that
 * namespace and renaming it would orphan every invoice anyone has saved.
 */
const SAVED_INVOICES_KEY = "savedInvoices";

const defaultInvoiceContext = {
  invoicePdf: new Blob(),
  invoicePdfLoading: false,
  savedInvoices: [] as InvoiceType[],
  pdfUrl: null as string | null,
  /** Timestamp of the last successful draft write, for the autosave indicator. */
  draftSavedAt: null as number | null,
  /** True while edits are sitting in the debounce window, unwritten. */
  draftPending: false,
  onFormSubmit: (values: InvoiceType) => {},
  newInvoice: () => {},
  generatePdf: async (data: InvoiceType) => {},
  removeFinalPdf: () => {},
  downloadPdf: () => {},
  printPdf: () => {},
  previewPdfInTab: () => {},
  saveInvoice: () => {},
  deleteInvoice: (index: number) => {},
  sendPdfToMail: (email: string): Promise<void> => Promise.resolve(),
  exportInvoiceAs: (exportAs: ExportTypes) => {},
  importInvoice: (file: File) => {},
};

export const InvoiceContext = createContext(defaultInvoiceContext);

export const useInvoiceContext = () => {
  return useContext(InvoiceContext);
};

type InvoiceContextProviderProps = {
  children: React.ReactNode;
};

export const InvoiceContextProvider = ({
  children,
}: InvoiceContextProviderProps) => {
  const router = useRouter();
  const locale = useLocale();

  // Toasts
  const {
    newInvoiceSuccess,
    pdfGenerationSuccess,
    saveInvoiceSuccess,
    modifiedInvoiceSuccess,
    sendPdfSuccess,
    sendPdfError,
    pdfGenerationError,
    exportInvoiceError,
    importInvoiceError,
  } = useToasts();

  // Get form values and methods from form context
  const { getValues, reset, watch } = useFormContext<InvoiceType>();

  // Variables
  const [invoicePdf, setInvoicePdf] = useState<Blob>(new Blob());
  const [invoicePdfLoading, setInvoicePdfLoading] = useState<boolean>(false);

  // Lets a new PDF request cancel the one it supersedes
  const generateAbortRef = useRef<AbortController | null>(null);

  // Saved invoices
  const [savedInvoices, setSavedInvoices] = useState<InvoiceType[]>([]);

  useEffect(() => {
    let active = true;
    // Encrypted at rest, so this is a promise now. The guard keeps a late
    // resolve from writing into an unmounted provider.
    readSecure<InvoiceType[]>(SAVED_INVOICES_KEY).then((saved) => {
      if (active) setSavedInvoices(Array.isArray(saved) ? saved : []);
    });
    return () => {
      active = false;
    };
  }, []);

  /*
   * Warm the PDF renderer.
   *
   * Chromium takes roughly 2.3s to launch, and on a cold serverless instance
   * the user paid all of it on their first Generate. Kicking the launch off
   * now overlaps it with filling in the form.
   *
   * Deliberately fire-and-forget: the result is ignored, and a failure leaves
   * generation to launch the browser itself exactly as before.
   */
  useEffect(() => {
    const controller = new AbortController();
    fetch(WARM_BROWSER_API, { signal: controller.signal }).catch(() => {});
    return () => controller.abort();
  }, []);

  /**
   * Draft autosave.
   *
   * This used to `JSON.stringify` the entire invoice inside the `watch`
   * callback — i.e. on every keystroke, synchronously. The invoice carries
   * `details.invoiceLogo`, a base64 data URL allowed up to 3,000,000
   * characters, so with a logo uploaded each character typed serialised
   * megabytes on the main thread. That was the single largest source of the
   * typing lag, and it was also what made modals feel slow: they open while
   * the user is mid-interaction, so the two costs landed together.
   *
   * Now the latest value is parked in a ref and written on a trailing timer.
   * The flush also runs when the tab is hidden or unloaded, so nothing is lost
   * if the user leaves inside the debounce window.
   */
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [draftPending, setDraftPending] = useState(false);
  const pendingDraftRef = useRef<unknown>(null);

  /*
   * Encryption makes this async, which costs one guarantee worth naming: a tab
   * killed inside the 600ms debounce may not finish the write, where the old
   * synchronous setItem would have. The visibilitychange-to-hidden flush below
   * is unaffected and fires on every ordinary way of leaving a page, so the
   * loss window is narrow.
   */
  const flushDraft = useCallback(() => {
    if (pendingDraftRef.current === null) return;
    const payload = pendingDraftRef.current;
    pendingDraftRef.current = null;

    void writeSecure(LOCAL_STORAGE_INVOICE_DRAFT_KEY, payload).then((ok) => {
      // A false result is quota, disabled storage, or no usable key. The draft
      // is a convenience, not a guarantee, so a failure must not break editing
      // — but it must not report "Saved" either.
      if (ok) setDraftSavedAt(Date.now());
    });

    setDraftPending(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const subscription = watch((value) => {
      pendingDraftRef.current = value;
      setDraftPending(true);

      if (timer) clearTimeout(timer);
      timer = setTimeout(flushDraft, DRAFT_SAVE_DEBOUNCE_MS);
    });

    // `pagehide` rather than `unload`, which is ignored on mobile Safari and
    // blocks the back/forward cache everywhere else.
    const onHide = () => flushDraft();
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      subscription.unsubscribe();
      if (timer) clearTimeout(timer);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
      flushDraft();
    };
  }, [watch, flushDraft]);

  /*
   * Editing returns you to the live preview.
   *
   * The preview column switches on `invoicePdf.size`, so once a PDF existed the
   * user was stuck looking at it: the only ways back were a "Back to live
   * preview" button in the corner and resetting the whole form. Generating was
   * effectively a mode you had to know how to leave, which is what made the two
   * preview surfaces confusing.
   *
   * Now the first edit after a generation drops the PDF. Generating becomes an
   * action with a result rather than a state you enter.
   */
  useEffect(() => {
    if (invoicePdf.size === 0) return;

    const subscription = watch((_value, { type }) => {
      // `type` is undefined for programmatic reset()/setValue() calls made
      // during hydration; only a real user change should discard the PDF.
      if (type === "change") setInvoicePdf(new Blob());
    });

    return () => subscription.unsubscribe();
  }, [invoicePdf.size, watch]);

  /*
   * Object URL for the generated PDF.
   *
   * This was a `useMemo` that created a URL and never revoked it, so every
   * generation leaked the whole PDF for the lifetime of the page. Held in
   * state instead, with the previous URL revoked on replace and on unmount.
   */
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (invoicePdf.size === 0) {
      setPdfUrl(null);
      return;
    }

    const url = window.URL.createObjectURL(invoicePdf);
    setPdfUrl(url);

    return () => window.URL.revokeObjectURL(url);
  }, [invoicePdf]);

  /**
   * Handles form submission.
   *
   * @param {InvoiceType} data - The form values used to generate the PDF.
   */
  const onFormSubmit = (data: InvoiceType) => {
    // Call generate pdf method
    generatePdf(data);
  };

  /**
   * Generates a new invoice.
   */
  const newInvoice = () => {
    /*
     * Suggest the next number rather than leaving the field blank.
     *
     * Derived from the most recent saved invoice, preserving whatever scheme
     * it used — INV0007 -> INV0008, 2026-14 -> 2026-15. It is only a
     * suggestion: the field stays a normal editable input, because an invoice
     * number is a legal identifier and people have their own conventions.
     */
    reset({
      ...FORM_DEFAULT_VALUES,
      details: {
        ...FORM_DEFAULT_VALUES.details,
        invoiceNumber: nextInvoiceNumber(savedInvoices),
      },
    });
    setInvoicePdf(new Blob());

    // Clear the draft
    void removeSecure(LOCAL_STORAGE_INVOICE_DRAFT_KEY);

    router.refresh();

    // Toast
    newInvoiceSuccess();
  };

  /**
   * Generate a PDF document based on the provided data.
   *
   * @param {InvoiceType} data - The data used to generate the PDF.
   * @returns {Promise<void>} - A promise that resolves when the PDF is successfully generated.
   * @throws {Error} - If an error occurs during the PDF generation process.
   */
  const generatePdf = useCallback(async (data: InvoiceType) => {
    // Cancel any in-flight generation so a re-submit doesn't race the previous
    // one and resolve out of order.
    generateAbortRef.current?.abort();
    const controller = new AbortController();
    generateAbortRef.current = controller;

    setInvoicePdfLoading(true);

    try {
      // Locale travels as a query param so the server can render the PDF in
      // the same language as the UI.
      const response = await fetch(`${GENERATE_PDF_API}?locale=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      /*
       * Without this check an error response was read as a PDF blob and, since
       * the JSON error body has a non-zero size, reported to the user as a
       * successful generation.
       */
      if (!response.ok) {
        throw new Error(
          `PDF generation failed with status ${response.status}`,
        );
      }

      const result = await response.blob();
      setInvoicePdf(result);

      if (result.size > 0) {
        // Toast
        pdfGenerationSuccess();
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        // Superseded by a newer submit; the newer one owns the loading state.
        return;
      }
      console.error(err);
      pdfGenerationError();
    } finally {
      if (generateAbortRef.current === controller) {
        generateAbortRef.current = null;
        setInvoicePdfLoading(false);
      }
    }
  }, [locale]);

  /**
   * Removes the final PDF file and switches to Live Preview
   */
  const removeFinalPdf = () => {
    setInvoicePdf(new Blob());
  };

  /**
   * Generates a preview of a PDF file and opens it in a new browser tab.
   */
  const previewPdfInTab = () => {
    // Reuses the managed URL rather than minting a second one. The previous
    // version created a fresh object URL per click and never revoked it —
    // revoking here is not an option either, since the new tab still needs it.
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  /**
   * Downloads a PDF file.
   */
  const downloadPdf = () => {
    // Only download if there is an invoice
    if (invoicePdf instanceof Blob && invoicePdf.size > 0) {
      // Create a blob URL to trigger the download
      const url = window.URL.createObjectURL(invoicePdf);

      // Create an anchor element to initiate the download
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    }
  };

  /**
   * Prints a PDF file.
   */
  const printPdf = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  // TODO: Change function name. (saveInvoiceData maybe?)
  /**
   * Saves the invoice data to local storage.
   */
  const saveInvoice = async () => {
    if (invoicePdf) {
      // If get values function is provided, allow to save the invoice
      if (getValues) {
        // Retrieve the existing array from storage or initialize an empty array
        const stored = await readSecure<InvoiceType[]>(SAVED_INVOICES_KEY);
        const savedInvoices: InvoiceType[] = Array.isArray(stored)
          ? stored
          : [];

        const updatedDate = new Date().toLocaleDateString(
          "en-US",
          SHORT_DATE_OPTIONS
        );

        const formValues = getValues();
        formValues.details.updatedAt = updatedDate;

        const existingInvoiceIndex = savedInvoices.findIndex(
          (invoice: InvoiceType) => {
            return (
              invoice.details.invoiceNumber === formValues.details.invoiceNumber
            );
          }
        );

        // If invoice already exists
        if (existingInvoiceIndex !== -1) {
          savedInvoices[existingInvoiceIndex] = formValues;

          // Toast
          modifiedInvoiceSuccess();
        } else {
          // Add the form values to the array
          savedInvoices.push(formValues);

          // Toast
          saveInvoiceSuccess();
        }

        await writeSecure(SAVED_INVOICES_KEY, savedInvoices);

        setSavedInvoices(savedInvoices);
      }
    }
  };

  // TODO: Change function name. (deleteInvoiceData maybe?)
  /**
   * Delete an invoice from local storage based on the given index.
   *
   * @param {number} index - The index of the invoice to be deleted.
   */
  const deleteInvoice = (index: number) => {
    if (index >= 0 && index < savedInvoices.length) {
      const updatedInvoices = [...savedInvoices];
      updatedInvoices.splice(index, 1);
      setSavedInvoices(updatedInvoices);

      void writeSecure(SAVED_INVOICES_KEY, updatedInvoices);
    }
  };

  /**
   * Send the invoice PDF to the specified email address.
   *
   * @param {string} email - The email address to which the Invoice PDF will be sent.
   * @returns {Promise<void>} A promise that resolves once the email is successfully sent.
   */
  const sendPdfToMail = (email: string) => {
    const fd = new FormData();
    fd.append("email", email);
    fd.append("invoicePdf", invoicePdf, "invoice.pdf");
    fd.append("invoiceNumber", getValues().details.invoiceNumber);

    return fetch(SEND_PDF_API, {
      method: "POST",
      body: fd,
    })
      .then((res) => {
        if (res.ok) {
          // Successful toast msg
          sendPdfSuccess();
        } else {
          // Error toast msg
          sendPdfError({ email, sendPdfToMail });
        }
      })
      .catch((error) => {
        console.log(error);

        // Error toast msg
        sendPdfError({ email, sendPdfToMail });
      });
  };

  /**
   * Export an invoice in the specified format using the provided form values.
   *
   * This function initiates the export process with the chosen export format and the form data.
   *
   * @param {ExportTypes} exportAs - The format in which to export the invoice.
   */
  const exportInvoiceAs = (exportAs: ExportTypes) => {
    const formValues = getValues();

    // Service to export invoice with given parameters
    exportInvoice(exportAs, formValues).catch((error) => {
      console.error("Error exporting invoice:", error);
      exportInvoiceError(error instanceof Error ? error.message : undefined);
    });
  };

  /**
   * Import an invoice from a JSON file.
   *
   * @param {File} file - The JSON file to import.
   */
  const importInvoice = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);

        // Parse the dates
        if (importedData.details) {
          if (importedData.details.invoiceDate) {
            importedData.details.invoiceDate = new Date(
              importedData.details.invoiceDate
            );
          }
          if (importedData.details.dueDate) {
            importedData.details.dueDate = new Date(
              importedData.details.dueDate
            );
          }
        }

        /*
         * Validate before resetting. This file is arbitrary user input, and an
         * unvalidated reset() put malformed shapes straight into form state,
         * which then flowed on to the PDF, export and email services.
         */
        const validated = InvoiceSchema.safeParse(importedData);
        if (!validated.success) {
          console.error("Invalid invoice file:", validated.error.issues);
          importInvoiceError();
          return;
        }

        // Reset form with imported data
        reset(importedData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        importInvoiceError();
      }
    };
    reader.readAsText(file);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoicePdf,
        invoicePdfLoading,
        savedInvoices,
        pdfUrl,
        draftSavedAt,
        draftPending,
        onFormSubmit,
        newInvoice,
        generatePdf,
        removeFinalPdf,
        downloadPdf,
        printPdf,
        previewPdfInTab,
        saveInvoice,
        deleteInvoice,
        sendPdfToMail,
        exportInvoiceAs,
        importInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
