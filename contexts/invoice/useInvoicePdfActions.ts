import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UseFormGetValues, UseFormReset } from "react-hook-form";

import { clearInvoiceDraft } from "@/lib/storage/invoiceDraft";
import {
  applyUserPreferencesToInvoice,
  readUserPreferences,
} from "@/lib/storage/userPreferences";
import {
  cleanupPdfCache,
  getCachedPdf,
  listCachedPdfMetadata,
  upsertCachedPdf,
} from "@/lib/storage/pdfCache";
import {
  PdfFilenameMeta,
  toPdfFilename,
  toPdfFilenameMeta,
} from "@/lib/invoice/pdfFilename";
import { FORM_DEFAULT_VALUES } from "@/lib/variables";
import { generatePdfBlob } from "@/lib/workers/pdfGeneratorClient";
import {
  captureClientError,
  trackClientEvent,
} from "@/lib/telemetry/clientTelemetry";
import { CachedPdfMeta, InvoiceType } from "@/types";

const toMetaMap = (items: CachedPdfMeta[]) => {
  return items.reduce<Record<string, CachedPdfMeta>>((acc, item) => {
    acc[item.invoiceNumber] = item;
    return acc;
  }, {});
};

type UseInvoicePdfActionsArgs = {
  getValues: UseFormGetValues<InvoiceType>;
  reset: UseFormReset<InvoiceType>;
  newInvoiceSuccess: () => void;
  pdfGenerationSuccess: () => void;
};

export const useInvoicePdfActions = ({
  getValues,
  reset,
  newInvoiceSuccess,
  pdfGenerationSuccess,
}: UseInvoicePdfActionsArgs) => {
  const [invoicePdf, setInvoicePdf] = useState<Blob>(new Blob());
  const [invoicePdfLoading, setInvoicePdfLoading] = useState<boolean>(false);
  const lastGeneratedPdfMetaRef = useRef<PdfFilenameMeta | null>(null);
  const [cachedPdfMetaByInvoiceNumber, setCachedPdfMetaByInvoiceNumber] =
    useState<Record<string, CachedPdfMeta>>({});
  const [isPdfCacheHydrated, setIsPdfCacheHydrated] = useState(false);

  const refreshCachedPdfMetadata = useCallback(async () => {
    try {
      const meta = await listCachedPdfMetadata();
      setCachedPdfMetaByInvoiceNumber(toMetaMap(meta));
    } catch {
      setCachedPdfMetaByInvoiceNumber({});
    }
  }, []);

  useEffect(() => {
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
        setIsPdfCacheHydrated(true);
      }
    };

    void hydratePdfCache();
  }, [refreshCachedPdfMetadata]);

  const resolvePdfFilenameMeta = useCallback(
    (source?: InvoiceType): PdfFilenameMeta => {
      const currentMeta = toPdfFilenameMeta(source ?? getValues());
      const snapshotMeta = lastGeneratedPdfMetaRef.current;

      if (!snapshotMeta) return currentMeta;

      const snapshotRecipientName = snapshotMeta.recipientName?.trim();
      const snapshotInvoiceNumber = snapshotMeta.invoiceNumber?.trim();

      return {
        recipientName: snapshotRecipientName || currentMeta.recipientName,
        invoiceNumber: snapshotInvoiceNumber || currentMeta.invoiceNumber,
      };
    },
    [getValues]
  );

  const generatePdf = useCallback(
    async (data: InvoiceType) => {
      setInvoicePdfLoading(true);

      try {
        const result = await generatePdfBlob(data);
        setInvoicePdf(result);
        lastGeneratedPdfMetaRef.current = toPdfFilenameMeta(data);

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

  const onFormSubmit = useCallback(
    (data: InvoiceType) => {
      void generatePdf(data);
    },
    [generatePdf]
  );

  const newInvoice = useCallback(() => {
    const preferences = readUserPreferences();
    reset(
      applyUserPreferencesToInvoice(
        FORM_DEFAULT_VALUES as unknown as InvoiceType,
        preferences
      )
    );
    setInvoicePdf(new Blob());
    lastGeneratedPdfMetaRef.current = null;
    clearInvoiceDraft();

    newInvoiceSuccess();
  }, [newInvoiceSuccess, reset]);

  const removeFinalPdf = useCallback(() => {
    setInvoicePdf(new Blob());
    lastGeneratedPdfMetaRef.current = null;
  }, []);

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

  const previewPdfInTab = useCallback(() => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  }, [pdfUrl]);

  const downloadPdf = useCallback(() => {
    if (invoicePdf instanceof Blob && invoicePdf.size > 0) {
      const filenameMeta = resolvePdfFilenameMeta();
      const fileName = toPdfFilename(filenameMeta);

      const url = window.URL.createObjectURL(invoicePdf);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [invoicePdf, resolvePdfFilenameMeta]);

  const printPdf = useCallback(() => {
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
  }, [invoicePdf]);

  const restorePdfFromCache = useCallback(
    async (invoiceNumber: string) => {
      try {
        const cached = await getCachedPdf(invoiceNumber);
        if (!cached) return false;

        setInvoicePdf(cached.pdfBlob);
        const cachedFilenameMeta = toPdfFilenameMeta(getValues());
        lastGeneratedPdfMetaRef.current = {
          ...cachedFilenameMeta,
          invoiceNumber,
        };

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
    },
    [getValues, refreshCachedPdfMetadata]
  );

  const getCachedPdfMeta = useCallback(
    (invoiceNumber: string) => {
      return cachedPdfMetaByInvoiceNumber[invoiceNumber] || null;
    },
    [cachedPdfMetaByInvoiceNumber]
  );

  const hasCachedPdf = useCallback(
    (invoiceNumber: string) => {
      return Boolean(cachedPdfMetaByInvoiceNumber[invoiceNumber]);
    },
    [cachedPdfMetaByInvoiceNumber]
  );

  return {
    invoicePdf,
    invoicePdfLoading,
    isPdfCacheHydrated,
    pdfUrl,
    resolvePdfFilenameMeta,
    onFormSubmit,
    newInvoice,
    generatePdf,
    removeFinalPdf,
    previewPdfInTab,
    downloadPdf,
    printPdf,
    restorePdfFromCache,
    getCachedPdfMeta,
    hasCachedPdf,
  };
};

export type UseInvoicePdfActionsReturn = ReturnType<typeof useInvoicePdfActions>;
