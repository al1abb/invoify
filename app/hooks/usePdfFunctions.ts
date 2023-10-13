import { useCallback, useEffect, useState } from "react";

// Variables
import { PDF_API } from "@/lib/variables";

// Toasts
import {
    pdfGenerationSuccess,
    saveInvoiceSuccess,
    modifiedInvoiceSuccess,
} from "@/lib/toasts";

// Types
import { GetValuesType, ValuesType } from "@/types";

const usePdfFunctions = (getValues: GetValuesType) => {
    const [invoicePdf, setInvoicePdf] = useState<Blob>(new Blob());
    const [invoicePdfLoading, setInvoicePdfLoading] = useState<boolean>(false);

    const [savedInvoices, setSavedInvoices] = useState<ValuesType[]>([]);

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

    /**
     * Generates a PDF using the provided data.
     *
     * @param {typeof InvoiceSchema} data - The data used to generate the PDF.
     * @return {Promise<void>} A promise that resolves once the PDF has been generated.
     *
     * @throws {Error} If there is an error generating the PDF.
     */
    const generatePdf = useCallback(
        async (data: ValuesType) => {
            setInvoicePdfLoading(true);

            try {
                const response = await fetch(`${PDF_API}`, {
                    method: "POST",
                    body: JSON.stringify(data),
                });

                const result = await response.blob();
                setInvoicePdf(result);

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
     * @return {void} - This function does not return any value.
     */
    const previewPdfInTab = () => {
        if (invoicePdf) {
            const url = window.URL.createObjectURL(invoicePdf);
            window.open(url, "_blank");
        }
    };

    /**
     * Saves the invoice data to local storage.
     *
     * @return {void} - This function does not return any value.
     */
    const saveInvoiceData = () => {
        if (invoicePdf) {
            // Retrieve the existing array from local storage or initialize an empty array
            const savedInvoicesJSON = localStorage.getItem("savedInvoices");
            const savedInvoices = savedInvoicesJSON
                ? JSON.parse(savedInvoicesJSON)
                : [];

            const formValues = getValues();

            const existingInvoiceIndex = savedInvoices.findIndex(
                (invoice: ValuesType) => {
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
            console.log("Saved", savedInvoices);
        }
    };

    const sendPdfToMail = (mail: string) => {
        console.log("sendPdfToMail", mail);
    };

    return {
        invoicePdf,
        invoicePdfLoading,
        savedInvoices,
        generatePdf,
        downloadPdf,
        previewPdfInTab,
        saveInvoiceData,
        sendPdfToMail,
    };
};

export { usePdfFunctions };
