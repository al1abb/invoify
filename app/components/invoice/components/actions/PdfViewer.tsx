"use client";

// Debounce
import { useDebounce } from "use-debounce";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Components
import {
    BaseButton,
    DynamicInvoiceTemplate,
    SendPdfToEmailModal,
} from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Icons
import { Download, Eye, Mail, MoveLeft, Printer, Save } from "lucide-react";

// Types
import { InvoiceType } from "@/types";

const PdfViewer = () => {
    const {
        invoicePdf,
        pdfUrl,
        removeFinalPdf,
        previewPdfInTab,
        downloadPdf,
        printPdf,
        saveInvoice,
        sendPdfToMail,
    } = useInvoiceContext();

    const { watch } = useFormContext<InvoiceType>();

    const [debouncedWatch] = useDebounce(watch, 1000);
    const formValues = debouncedWatch();

    return (
        <div className="my-3">
            {invoicePdf.size == 0 ? (
                <>
                    <p className="text-xl font-semibold">Live Preview:</p>
                    <div className="border dark:border-none rounded-xl my-1">
                        <DynamicInvoiceTemplate {...formValues} />
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center mb-3">
                        <BaseButton
                            variant={"outline"}
                            onClick={removeFinalPdf}
                        >
                            <MoveLeft />
                            Back to Live Preview
                        </BaseButton>
                    </div>
                    <p className="text-xl font-semibold">Final PDF:</p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-x-2 my-1">
                        <BaseButton
                            tooltipLabel="Preview invoice in new tab"
                            onClick={previewPdfInTab}
                            size="icon"
                            variant={"outline"}
                        >
                            <Eye />
                        </BaseButton>
                        <BaseButton
                            tooltipLabel="Download invoice PDF"
                            onClick={downloadPdf}
                            size="icon"
                            variant={"outline"}
                        >
                            <Download />
                        </BaseButton>

                        <BaseButton
                            tooltipLabel="Print invoice"
                            onClick={printPdf}
                            size="icon"
                            variant={"outline"}
                        >
                            <Printer />
                        </BaseButton>

                        <BaseButton
                            tooltipLabel="Save invoice in website"
                            onClick={saveInvoice}
                            size="icon"
                            variant={"outline"}
                        >
                            <Save />
                        </BaseButton>

                        <SendPdfToEmailModal sendPdfToMail={sendPdfToMail}>
                            <BaseButton
                                tooltipLabel="Send invoice PDF to mail"
                                size="icon"
                                variant={"outline"}
                            >
                                <Mail />
                            </BaseButton>
                        </SendPdfToEmailModal>
                    </div>
                    <AspectRatio ratio={1 / 1.4}>
                        <iframe
                            className="h-full w-full rounded-xl"
                            src={`${pdfUrl}#toolbar=0`}
                        ></iframe>
                    </AspectRatio>
                </>
            )}
        </div>
    );
};

export default PdfViewer;
