import { useCallback } from "react";
import { UseFormGetValues, UseFormReset } from "react-hook-form";

import { toApiErrorMessage } from "@/lib/contracts/invoiceApi";
import { PdfFilenameMeta, toPdfFilename } from "@/lib/invoice/pdfFilename";
import {
  captureClientError,
  trackClientEvent,
} from "@/lib/telemetry/clientTelemetry";
import { SEND_PDF_API } from "@/lib/variables";
import { exportInvoice } from "@/services/invoice/client/exportInvoice";
import { updateSavedInvoiceStatusByInvoiceNumber as updateSavedInvoiceStatusByInvoiceNumberInRecords } from "@/lib/storage/savedInvoices";
import {
  EmailMessageOptions,
  ExportTypes,
  InvoiceType,
  SavedInvoiceRecord,
} from "@/types";

type PersistSavedInvoices = (
  nextRecords: SavedInvoiceRecord[],
  action: string,
  metadata?: Record<string, unknown>
) => void;

type SendPdfErrorArgs = {
  email: string;
  sendPdfToMail: (
    email: string,
    messageOptions?: EmailMessageOptions
  ) => Promise<void>;
  messageOptions?: EmailMessageOptions;
  reason?: string;
};

type ExportInvoiceErrorArgs = {
  exportAs: ExportTypes;
  exportInvoiceAs: (exportAs: ExportTypes) => void;
  reason?: string;
};

type UseInvoiceExportAndEmailArgs = {
  getValues: UseFormGetValues<InvoiceType>;
  reset: UseFormReset<InvoiceType>;
  invoicePdf: Blob;
  savedInvoices: SavedInvoiceRecord[];
  persistSavedInvoices: PersistSavedInvoices;
  resolvePdfFilenameMeta: (source?: InvoiceType) => PdfFilenameMeta;
  sendPdfSuccess: () => void;
  sendPdfError: (args: SendPdfErrorArgs) => void;
  importInvoiceError: () => void;
  exportInvoiceError: (args: ExportInvoiceErrorArgs) => void;
};

export const useInvoiceExportAndEmail = ({
  getValues,
  reset,
  invoicePdf,
  savedInvoices,
  persistSavedInvoices,
  resolvePdfFilenameMeta,
  sendPdfSuccess,
  sendPdfError,
  importInvoiceError,
  exportInvoiceError,
}: UseInvoiceExportAndEmailArgs) => {
  const sendPdfToMail = useCallback(
    (email: string, messageOptions?: EmailMessageOptions) => {
      const currentFormValues = getValues();
      const invoiceNumber = currentFormValues.details.invoiceNumber;
      const filenameMeta = resolvePdfFilenameMeta(currentFormValues);
      const attachmentFilename = toPdfFilename(filenameMeta);

      const fd = new FormData();
      fd.append("email", email);
      fd.append("invoicePdf", invoicePdf, attachmentFilename);
      fd.append("invoiceNumber", invoiceNumber);
      if (messageOptions?.subject?.trim()) {
        fd.append("subject", messageOptions.subject.trim());
      }
      if (messageOptions?.body?.trim()) {
        fd.append("body", messageOptions.body.trim());
      }
      if (messageOptions?.footer?.trim()) {
        fd.append("footer", messageOptions.footer.trim());
      }

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
              persistSavedInvoices(updatedInvoices, "email_status_update", {
                invoiceNumber,
              });
            }
          } else {
            let errorPayload: unknown = null;
            try {
              errorPayload = await res.json();
            } catch {
              // no-op
            }
            const errorMessage = toApiErrorMessage(
              errorPayload,
              `Failed to send email (${res.status})`
            );
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
              messageOptions,
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
            messageOptions,
            reason: error instanceof Error ? error.message : "Failed to send email",
          });
        });
    },
    [
      getValues,
      invoicePdf,
      persistSavedInvoices,
      resolvePdfFilenameMeta,
      savedInvoices,
      sendPdfError,
      sendPdfSuccess,
    ]
  );

  const exportInvoiceAs = useCallback(
    (exportAs: ExportTypes) => {
      const formValues = getValues();
      exportInvoice(exportAs, formValues).catch((error) => {
        const reason =
          error instanceof Error
            ? error.message
            : "Something went wrong while exporting the invoice";
        captureClientError("app_error", error, {
          area: "invoice_export",
          exportAs,
        });

        exportInvoiceError({
          exportAs,
          exportInvoiceAs,
          reason,
        });
      });
    },
    [exportInvoiceError, getValues]
  );

  const importInvoice = useCallback(
    (file: File) => {
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
    },
    [importInvoiceError, reset]
  );

  return {
    sendPdfToMail,
    exportInvoiceAs,
    importInvoice,
  };
};
