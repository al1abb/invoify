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
} from "@/lib/variables";

// Types
import { ExportTypes, InvoiceType } from "@/types";

const defaultInvoiceContext = {
    invoicePdf: new Blob(),
    invoicePdfLoading: false,
    savedInvoices: [] as InvoiceType[],
    pdfUrl: null as string | null,
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
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
};
