"use client";

// Form imports
import { useForm } from "react-hook-form";

// Zod imports
import { zodResolver } from "@hookform/resolvers/zod";

// Form schemas
import { InvoiceSchema } from "@/lib/schemas";

// Shadcn
import { Form } from "@/components/ui/form";

// Custom components
import { InvoiceActions, InvoiceForm } from "..";

// Hooks
import { usePdfFunctions } from "../../hooks/usePdfFunctions";

// Variables
import { FORM_DEFAULT_VALUES } from "@/lib/variables";

// Types
import { ValuesType } from "@/types";

const InvoiceMain = () => {
    const form = useForm<ValuesType>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: FORM_DEFAULT_VALUES,
    });

    const { getValues, setValue, reset, handleSubmit } = form;

    // TODO: Move this hook to invoice actions and pass getValues to InvoiceActions
    const {
        invoicePdf,
        invoicePdfLoading,
        savedInvoices,
        generatePdf,
        downloadPdf,
        previewPdfInTab,
        saveInvoiceData,
        sendPdfToMail,
    } = usePdfFunctions(getValues);

    const onSubmit = (values: ValuesType) => {
        console.log("VALUE");
        console.log(values);
        generatePdf(values);
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap">
                        <InvoiceForm
                            control={form.control}
                            savedInvoices={savedInvoices}
                            onSubmit={onSubmit}
                            reset={reset}
                            setValue={setValue}
                        />

                        <InvoiceActions
                            invoicePdfLoading={invoicePdfLoading}
                            invoicePdf={invoicePdf}
                            downloadPdf={downloadPdf}
                            previewPdfInTab={previewPdfInTab}
                            savePdf={saveInvoiceData}
                            sendPdfToMail={sendPdfToMail}
                            reset={reset}
                        />
                    </div>
                </form>
            </Form>
        </>
    );
};

export default InvoiceMain;
