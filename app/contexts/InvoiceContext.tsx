"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

// Types
import { GetValuesType, ValuesType } from "@/types";

// Variables
import { PDF_API, SEND_PDF_API } from "@/lib/variables";

// Toasts
import {
    modifiedInvoiceSuccess,
    pdfGenerationSuccess,
    saveInvoiceSuccess,
    sendPdfError,
    sendPdfSuccess,
} from "@/lib/toasts";

const defaultInvoiceContext = {
    invoicePdf: new Blob(),
    invoicePdfLoading: false,
    savedInvoices: [] as ValuesType[],
    generatePdf: async (data: ValuesType) => {},
    downloadPdf: () => {},
    previewPdfInTab: () => {},
    saveInvoice: () => {},
    deleteInvoice: (index: number) => {},
    sendPdfToMail: (email: string): Promise<void> => Promise.resolve(),
};

export const InvoiceContext = createContext(defaultInvoiceContext);

export const useInvoiceContext = () => {
    useContext(InvoiceContext);
};

type InvoiceContextProviderProps = {
    children: React.ReactNode;
    getValues: GetValuesType;
};

export const InvoiceContextProvider = ({
    children,
    getValues,
}: InvoiceContextProviderProps) => {
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

            console.log("USE CALLBACK");
            console.log(invoicePdf);

            try {
                const response = await fetch(PDF_API, {
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
    const saveInvoice = () => {
        if (invoicePdf) {
            // If get values function is provided, allow to save the invoice
            if (getValues) {
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
            }
        }
    };

    /**
     * Deletes an invoice from local storage based on given index number.
     *
     * @param index Index of the invoice to delete
     *
     * @return {void} - This function does not return any value
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
     * Sends the invoice PDF to the specified email address
     *
     * @param email Email to send Invoice PDF
     *
     * @returns {Promise<void>} Promise that resolves when the email is sent
     */
    const sendPdfToMail = (email: string) => {
        const fd = new FormData();
        fd.append("email", email);
        fd.append("invoicePdf", invoicePdf, "invoice.pdf");

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
                    sendPdfError();
                }
            })
            .catch((error) => {
                console.log(error);

                // Error toast msg
                sendPdfError();
            });
    };

    return (
        <InvoiceContext.Provider
            value={{
                invoicePdf,
                invoicePdfLoading,
                savedInvoices,
                generatePdf,
                downloadPdf,
                previewPdfInTab,
                saveInvoice,
                deleteInvoice,
                sendPdfToMail,
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
};
