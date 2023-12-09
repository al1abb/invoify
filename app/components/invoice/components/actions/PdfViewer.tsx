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
    Subheading,
} from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Icons
import {
    BookmarkIcon,
    DownloadCloudIcon,
    Eye,
    Mail,
    MoveLeft,
    Printer,
} from "lucide-react";

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
                    <Subheading>Live Preview:</Subheading>
                    <div className="border dark:border-none rounded-xl my-1">
                        <DynamicInvoiceTemplate {...formValues} />
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center mb-3">
                        <BaseButton
                            variant={"ghost"}
                            size="sm"
                            onClick={removeFinalPdf}
                        >
                            <MoveLeft className="w-5 h-5" />
                            Back to Live Preview
                        </BaseButton>
                    </div>
                    <Subheading>Final PDF:</Subheading>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2 my-1">
                        <BaseButton
                            tooltipLabel="Preview invoice in new tab"
                            onClick={previewPdfInTab}
                            size="sm"
                            variant={"outline"}
                        >
                            <Eye className="w-5 h-5" />
                            Preview
                        </BaseButton>
                        <BaseButton
                            tooltipLabel="Download invoice PDF"
                            onClick={downloadPdf}
                            size="sm"
                            variant={"outline"}
                        >
                            <DownloadCloudIcon className="w-5 h-5" />
                            Download
                        </BaseButton>

                        <BaseButton
                            tooltipLabel="Print invoice"
                            onClick={printPdf}
                            size="sm"
                            variant={"outline"}
                        >
                            <Printer className="w-5 h-5" />
                            Print
                        </BaseButton>

                        <BaseButton
                            tooltipLabel="Save invoice in website"
                            onClick={saveInvoice}
                            size="sm"
                            variant={"outline"}
                        >
                            <BookmarkIcon className="w-5 h-5" />
                            Save
                        </BaseButton>

                        <SendPdfToEmailModal sendPdfToMail={sendPdfToMail}>
                            <BaseButton
                                tooltipLabel="Send invoice PDF to mail"
                                size="sm"
                                variant={"outline"}
                            >
                                <Mail className="w-5 h-5" />
                                Send to mail
                            </BaseButton>
                        </SendPdfToEmailModal>
                    </div>
                    <AspectRatio ratio={1 / 1.4}>
                        <iframe
                            className="h-full w-full rounded-xl"
                            src={`${pdfUrl}#toolbar=0`}
                        />
                    </AspectRatio>
                </>
            )}
        </div>
    );
};

export default PdfViewer;
