import { useMemo } from "react";

// ShadCn components
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Components
import { BaseButton, SendPdfToEmailModal } from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Icons
import { Download, Eye, Mail, Save } from "lucide-react";

type PdfViewerProps = {
    pdfBlob: Blob;
};

const PdfViewer = ({ pdfBlob }: PdfViewerProps) => {
    const { previewPdfInTab, downloadPdf, saveInvoice, sendPdfToMail } =
        useInvoiceContext();

    const pdfUrl = useMemo(() => {
        return window.URL.createObjectURL(pdfBlob);
    }, [pdfBlob]);
    return (
        <>
            <p className="text-xl font-semibold my-2">PDF View</p>
            <div className="flex flex-row gap-2 py-3">
                <BaseButton
                    tooltipLabel="Preview invoice in new tab"
                    onClick={previewPdfInTab}
                    size="icon"
                >
                    <Eye />
                </BaseButton>
                <BaseButton
                    tooltipLabel="Download invoice PDF"
                    onClick={downloadPdf}
                    size="icon"
                >
                    <Download />
                </BaseButton>
                <BaseButton
                    tooltipLabel="Save invoice in website"
                    onClick={saveInvoice}
                    size="icon"
                >
                    <Save />
                </BaseButton>

                <SendPdfToEmailModal sendPdfToMail={sendPdfToMail}>
                    <BaseButton
                        tooltipLabel="Send invoice PDF to mail"
                        size="icon"
                    >
                        <Mail />
                    </BaseButton>
                </SendPdfToEmailModal>
            </div>
            <AspectRatio ratio={1 / 1.4}>
                <iframe
                    className="h-full w-full"
                    src={`${pdfUrl}#toolbar=0`}
                ></iframe>
            </AspectRatio>
        </>
    );
};

export default PdfViewer;
