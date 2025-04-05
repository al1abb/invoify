"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

// RHF
import { useFormContext } from "react-hook-form";

// Hooks
import useToasts from "@/hooks/useToasts";

// Services
import { exportInvoice } from "@/services/invoice/client/exportInvoice";

// Variables
import {
  FORM_DEFAULT_VALUES,
  GENERATE_PDF_API,
  SEND_PDF_API,
  SHORT_DATE_OPTIONS,
  TAILWIND_CDN,
} from "@/lib/variables";

// Types
import { ExportTypes, InvoiceType } from "@/types";
import { getInvoiceTemplate } from "@/lib/helpers";

const defaultInvoiceContext = {
  invoicePdf: new Blob(),
  invoicePdfLoading: false,
  savedInvoices: [] as InvoiceType[],
  pdfUrl: null as string | null,
  onFormSubmit: (values: InvoiceType) => { },
  newInvoice: () => { },
  generatePdf: async (data: InvoiceType) => { },
  removeFinalPdf: () => { },
  downloadPdf: () => { },
  printPdf: () => { },
  previewPdfInTab: () => { },
  saveInvoice: () => { },
  deleteInvoice: (index: number) => { },
  sendPdfToMail: (email: string): Promise<void> => Promise.resolve(),
  exportInvoiceAs: (exportAs: ExportTypes) => { },
  importInvoice: (file: File) => { },
  printPdfImmediatelyAndPrivately: (data: InvoiceType) => { },
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

  // Toasts
  const {
    newInvoiceSuccess,
    pdfGenerationSuccess,
    saveInvoiceSuccess,
    modifiedInvoiceSuccess,
    sendPdfSuccess,
    sendPdfError,
    importInvoiceError,
    printPdfImmediatelyAndPrivatelyError
  } = useToasts();

  // Get form values and methods from form context
  const { getValues, reset } = useFormContext<InvoiceType>();

  // Variables
  const [invoicePdf, setInvoicePdf] = useState<Blob>(new Blob());
  const [invoicePdfLoading, setInvoicePdfLoading] = useState<boolean>(false);

  // Saved invoices
  const [savedInvoices, setSavedInvoices] = useState<InvoiceType[]>([]);

  useEffect(() => {
    let savedInvoicesDefault;
    if (typeof window !== undefined) {
      // Saved invoices variables
      const savedInvoicesJSON =
        window.localStorage.getItem("savedInvoices");
      savedInvoicesDefault = savedInvoicesJSON
        ? JSON.parse(savedInvoicesJSON)
        : [];
      setSavedInvoices(savedInvoicesDefault);
    }
  }, []);

  // Get pdf url from blob
  const pdfUrl = useMemo(() => {
    if (invoicePdf.size > 0) {
      return window.URL.createObjectURL(invoicePdf);
    }
    return null;
  }, [invoicePdf]);

  /**
   * Handles form submission.
   *
   * @param {InvoiceType} data - The form values used to generate the PDF.
   */
  const onFormSubmit = (data: InvoiceType) => {
    console.log("VALUE");
    console.log(data);

    // Call generate pdf method
    generatePdf(data);
  };

  /**
   * Generates a new invoice.
   */
  const newInvoice = () => {
    reset(FORM_DEFAULT_VALUES);
    setInvoicePdf(new Blob());

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
    setInvoicePdfLoading(true);

    try {
      const response = await fetch(GENERATE_PDF_API, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.blob();
      setInvoicePdf(result);

      if (result.size > 0) {
        // Toast
        pdfGenerationSuccess();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setInvoicePdfLoading(false);
    }
  }, []);

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
    if (invoicePdf) {
      const url = window.URL.createObjectURL(invoicePdf);
      window.open(url, "_blank");
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
    if (invoicePdf) {
      const pdfUrl = URL.createObjectURL(invoicePdf);
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
  const saveInvoice = () => {
    if (invoicePdf) {
      // If get values function is provided, allow to save the invoice
      if (getValues) {
        // Retrieve the existing array from local storage or initialize an empty array
        const savedInvoicesJSON = localStorage.getItem("savedInvoices");
        const savedInvoices = savedInvoicesJSON
          ? JSON.parse(savedInvoicesJSON)
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
              invoice.details.invoiceNumber ===
              formValues.details.invoiceNumber
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

        localStorage.setItem(
          "savedInvoices",
          JSON.stringify(savedInvoices)
        );

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

      const updatedInvoicesJSON = JSON.stringify(updatedInvoices);

      localStorage.setItem("savedInvoices", updatedInvoicesJSON);
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
    exportInvoice(exportAs, formValues);
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

        // Reset form with imported data
        reset(importedData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        importInvoiceError();
      }
    };
    reader.readAsText(file);
  };

  const printPdfImmediatelyAndPrivately = useCallback(async (data: InvoiceType) => {
    try {

      const ReactDOMServer = (await import("react-dom/server")).default;

      // Get the selected invoice template
      const templateId = data.details.pdfTemplate;
      const InvoiceTemplate = await getInvoiceTemplate(templateId);

      // Read the HTML template from a React component
      const htmlTemplate = `<link rel="stylesheet" href="${TAILWIND_CDN}">`.concat(ReactDOMServer.renderToStaticMarkup(
        InvoiceTemplate(data)
      ));

      // Open window with a descriptive name
      const printWindow = window.open("", "invoice_print_view", "width=800,height=800");

      if (!printWindow) {
        throw new Error("Popup blocked. Please allow popups for this site to print invoices.");
      }

      printWindow.document.open();
      printWindow.document.write(htmlTemplate);
      printWindow.document.close();

      // Handle printing with proper cleanup
      return new Promise<void>((resolve, reject) => {
        // Use a flag to prevent double printing
        let printAttempted = false;

        printWindow.onload = () => {
          try {
            if (printAttempted) return;
            printAttempted = true;

            setTimeout(() => {
              printWindow.print();
              // Close window after printing or after cancellation
              setTimeout(() => {
                printWindow.close();
                resolve();
              }, 500);
            }, 500); // Short delay to ensure content rendering
          } catch (err) {
            printWindow.close();
            reject(err);
          }
        };

        // Fallback if onload doesn't trigger
        setTimeout(() => {
          if (!printAttempted && printWindow.document.readyState === 'complete') {
            try {
              printAttempted = true;
              printWindow.print();
              setTimeout(() => printWindow.close(), 1000);
              resolve();
            } catch (err) {
              printWindow.close();
              reject(err);
            }
          } else if (!printAttempted) {
            // If document still not ready after timeout, close and reject
            printWindow.close();
            reject(new Error("Failed to prepare document for printing"));
          }
        }, 3000);

        // Safety timeout to ensure the window always closes
        setTimeout(() => {
          if (printWindow && !printWindow.closed) {
            printWindow.close();
            if (!printAttempted) {
              reject(new Error("Print operation timed out"));
            }
          }
        }, 10000);
      });
    } catch (error) {
      printPdfImmediatelyAndPrivatelyError((error as Error).message);
    } finally {
      setInvoicePdfLoading(false);
    }
  }, []);


  return (
    <InvoiceContext.Provider
      value={{
        invoicePdf,
        invoicePdfLoading,
        savedInvoices,
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
        sendPdfToMail,
        exportInvoiceAs,
        importInvoice,
        printPdfImmediatelyAndPrivately
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
