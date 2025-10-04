"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// Hooks
import useToasts from "@/hooks/useToasts";

// Types
import { ProductCatalogData } from "@/app/components/templates/catalog-pdf/catalog_contant";

const defaultCatalogContext = {
  catalogPdf: new Blob(),
  catalogPdfLoading: false,
  pdfUrl: null as string | null,
  generatePdf: async (data: ProductCatalogData) => {},
  removeFinalPdf: () => {},
  downloadPdf: () => {},
  printPdf: () => {},
  previewPdfInTab: () => {},
};

export const CatalogContext = createContext(defaultCatalogContext);

export const useCatalogContext = () => {
  return useContext(CatalogContext);
};

type CatalogContextProviderProps = {
  children: React.ReactNode;
};

export const CatalogContextProvider = ({
  children,
}: CatalogContextProviderProps) => {
  // Toasts
  const {
    pdfGenerationSuccess,
  } = useToasts();

  // Variables
  const [catalogPdf, setCatalogPdf] = useState<Blob>(new Blob());
  const [catalogPdfLoading, setCatalogPdfLoading] = useState<boolean>(false);

  // Get pdf url from blob
  const pdfUrl = useMemo(() => {
    if (catalogPdf.size > 0) {
      return window.URL.createObjectURL(catalogPdf);
    }
    return null;
  }, [catalogPdf]);

  /**
   * Generate a PDF document based on the provided data.
   *
   * @param {ProductCatalogData} data - The data used to generate the PDF.
   * @returns {Promise<void>} - A promise that resolves when the PDF is successfully generated.
   * @throws {Error} - If an error occurs during the PDF generation process.
   */
  const generatePdf = useCallback(async (data: ProductCatalogData) => {
    setCatalogPdfLoading(true);

    try {
      const response = await fetch("/api/catalog/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify(data),
      });

      const result = await response.blob();
      setCatalogPdf(result);

      if (result.size > 0) {
        // Toast
        pdfGenerationSuccess();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setCatalogPdfLoading(false);
    }
  }, [pdfGenerationSuccess]);

  /**
   * Removes the final PDF file and switches to Live Preview
   */
  const removeFinalPdf = () => {
    setCatalogPdf(new Blob());
  };

  /**
   * Generates a preview of a PDF file and opens it in a new browser tab.
   */
  const previewPdfInTab = () => {
    if (catalogPdf) {
      const url = window.URL.createObjectURL(catalogPdf);
      window.open(url, "_blank");
    }
  };

  /**
   * Downloads a PDF file.
   */
  const downloadPdf = () => {
    // Only download if there is a catalog
    if (catalogPdf instanceof Blob && catalogPdf.size > 0) {
      // Create a blob URL to trigger the download
      const url = window.URL.createObjectURL(catalogPdf);

      // Create an anchor element to initiate the download
      const a = document.createElement("a");
      a.href = url;
      a.download = "product-catalog.pdf";
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
    if (catalogPdf) {
      const pdfUrl = URL.createObjectURL(catalogPdf);
      const printWindow = window.open(pdfUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  return (
    <CatalogContext.Provider
      value={{
        catalogPdf,
        catalogPdfLoading,
        pdfUrl,
        generatePdf,
        removeFinalPdf,
        downloadPdf,
        printPdf,
        previewPdfInTab,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};
