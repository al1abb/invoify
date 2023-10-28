"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Form } from "@/components/ui/form";

// Custom components
import { InvoiceActions, InvoiceForm } from "@/app/components";

// Context
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/app/types/types";

const InvoiceMain = () => {
    const { handleSubmit } = useFormContext<InvoiceType>();

    //* Get the values from invoice context
    const {
        invoicePdf,
        invoicePdfLoading,
        onFormSubmit,
        downloadPdf,
        previewPdfInTab,
        saveInvoice,
        sendPdfToMail,
    } = useInvoiceContext();

    return (
        <>
            <Form {...useFormContext<InvoiceType>()}>
                <form
                    onSubmit={handleSubmit(onFormSubmit, (err) => {
                        console.log(err);
                    })}
                >
                    <div className="flex flex-wrap">
                        <InvoiceForm />

                        <InvoiceActions
                            invoicePdfLoading={invoicePdfLoading}
                            invoicePdf={invoicePdf}
                            downloadPdf={downloadPdf}
                            previewPdfInTab={previewPdfInTab}
                            saveInvoice={saveInvoice}
                            sendPdfToMail={sendPdfToMail}
                        />
                    </div>
                </form>
            </Form>
        </>
    );
};

export default InvoiceMain;
