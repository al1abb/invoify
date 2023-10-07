import { useCallback, useEffect, useState } from "react";

// Variables
import { PDF_API } from "@/lib/variables";

// Zod
import z from "zod";

// Form Schema
import { InvoiceSchema } from "@/lib/schemas";
import { pdfGenerationSuccess } from "@/lib/toasts";

const usePdfFunctions = () => {
    const [invoicePdf, setInvoicePdf] = useState<string | null>(null);
    const [invoicePdfLoading, setInvoicePdfLoading] = useState<boolean>(false);

    /**
     * Generates a PDF using the provided data.
     *
     * @param {typeof InvoiceSchema} data - The data used to generate the PDF.
     * @return {Promise<void>} A promise that resolves once the PDF has been generated.
     *
     * @throws {Error} If there is an error generating the PDF.
     */
    const generatePdf = useCallback(
        async (data: z.infer<typeof InvoiceSchema>) => {
            setInvoicePdfLoading(true);

            try {
                const response = await fetch(`${PDF_API}`, {
                    method: "POST",
                    body: JSON.stringify(data),
                });

                const result = await response.blob();
                const pdfUrl = window.URL.createObjectURL(result);
                setInvoicePdf(pdfUrl);

                // Toast
                pdfGenerationSuccess();
            } catch (err) {
                console.log(err);
            } finally {
                setInvoicePdfLoading(false);
            }
        },
        [setInvoicePdf, setInvoicePdfLoading]
    );

    /**
     * Downloads a PDF file.
     *
     * @return {undefined} No return value.
     */
    const downloadPdf = () => {
        if (invoicePdf) {
            // Create a blob URL to trigger the download
            const url = invoicePdf;

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
     * Generates a preview of a PDF file and opens it in a new browser tab.
     *
     * @return {void} - This function does not return any value.
     */
    const previewPdfInTab = () => {
        if (invoicePdf) {
            window.open(invoicePdf, "_blank");
        }
    };

    return {
        invoicePdf,
        invoicePdfLoading,
        generatePdf,
        downloadPdf,
        previewPdfInTab,
    };
};

export { usePdfFunctions };
