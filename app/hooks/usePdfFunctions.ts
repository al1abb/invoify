import { useState } from "react";

// Variables
import { PDF_API } from "@/lib/variables";

const usePdfFunctions = () => {
    const [invoicePdf, setInvoicePdf] = useState<Blob>(new Blob());
    const [invoicePdfLoading, setInvoicePdfLoading] = useState<boolean>(false);

    /**
     * Generates a PDF using the provided data.
     *
     * @param {any} data - The data used to generate the PDF.
     * @return {Promise<void>} A promise that resolves once the PDF has been generated.
     */
    const generatePdf = async (data: any) => {
        setInvoicePdfLoading(true);
        
        try {
            const response = await fetch(`${PDF_API}`, {
                method: "POST",
                body: JSON.stringify(data),
            });
    
            const result = await response.blob()
            setInvoicePdf(result);
        } catch(err) {
            console.log(err)
        } finally {
            setInvoicePdfLoading(false);
        }
    };

    /**
     * Downloads a PDF file.
     *
     * @return {undefined} No return value.
     */
    const downloadPdf = () => {
        if (invoicePdf) {
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
     * Generates a preview of a PDF file and opens it in a new browser tab.
     *
     * @param {none} - This function does not accept any parameters.
     * @return {void} - This function does not return any value.
     */
    const previewPdfInTab = () => {
        if (invoicePdf) {
            const url = window.URL.createObjectURL(invoicePdf);
            window.open(url, "_blank");
        }
    };

    return {
        invoicePdf,
        invoicePdfLoading,
        generatePdf,
        downloadPdf,
        previewPdfInTab
    };
};

export { usePdfFunctions };