"use client";

// Debounce
import { useDebounce } from "use-debounce";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Components
import { FinalPdf, LivePreview } from "@/app/components";

// Contexts
import { useInvoicePdfViewerContext } from "@/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/types";

const LivePreviewContent = () => {
    const { control, getValues } = useFormContext<InvoiceType>();
    const watchedValues = useWatch({
        control,
        defaultValue: getValues(),
    });
    const [formValues] = useDebounce(watchedValues, 300);

    return <LivePreview data={formValues as InvoiceType} />;
};

const PdfViewer = () => {
    const { invoicePdf } = useInvoicePdfViewerContext();

    return (
        <div className="my-3">
            {invoicePdf.size == 0 ? (
                <LivePreviewContent />
            ) : (
                <FinalPdf />
            )}
        </div>
    );
};

export default PdfViewer;
