"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

// RHF
import { useFormContext } from "react-hook-form";

// Hooks
import useToasts from "../hooks/useToasts";

// Services
import { exportInvoice } from "@/app/services/pdf/exportInvoice";

// Variables
import {
    FORM_DEFAULT_VALUES,
    GENERATE_PDF_API,
    SEND_PDF_API,
    SHORT_DATE_OPTIONS,
} from "@/lib/variables";

// Types
import { ExportTypes, InvoiceType } from "@/app/types/types";

const defaultInvoiceContext = {
    invoicePdf: new Blob(),
    invoicePdfLoading: false,
    savedInvoices: [] as InvoiceType[],
    onFormSubmit: (values: InvoiceType) => {},
    newInvoice: () => {},
    generatePdf: async (data: InvoiceType) => {},
    downloadPdf: () => {},
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
        modifiedInvoiceSuccess,
        pdfGenerationSuccess,
        saveInvoiceSuccess,
        sendPdfError,
        sendPdfSuccess,
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

    /**
     * Handles form submission.
     *
     * @param values - The form data used to generate the PDF.
     */
    const onFormSubmit = (values: InvoiceType) => {
        console.log("VALUE");
        console.log(values);

        // Call generate pdf service
        generatePdf(values);
    };

    /**
     * Generates a new invoice.
     *
     * @return {void} - This function does not return any value.
     */
    const newInvoice = () => {
        reset(FORM_DEFAULT_VALUES);
        router.refresh();
    };

    /**
     * Generates a PDF using the provided data.
     *
     * @param {InvoiceType} data - The data used to generate the PDF.
     * @return {Promise<void>} A promise that resolves once the PDF has been generated.
     *
     * @throws {Error} If there is an error generating the PDF.
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

            if (result) {
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
     * Downloads a PDF file.
     *
     * @return {void} No return value.
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

                const updatedDate = new Date().toLocaleDateString(
                    undefined,
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
     * Export an invoice in the specified format.
     * This function exports an invoice using the provided export format and form values.
     *
     * @param exportAs Export as type
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
                onFormSubmit,
                newInvoice,
                generatePdf,
                downloadPdf,
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
