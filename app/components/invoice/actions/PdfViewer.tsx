"use client";

// Debounce
import { useDebounce } from "use-debounce";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Components
import { FinalPdf, LivePreview } from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/types";

const PdfViewer = () => {
    const { invoicePdf } = useInvoiceContext();

    const { control, getValues } = useFormContext<InvoiceType>();
    const watchedValues = useWatch({
        control,
        defaultValue: getValues(),
    });
    const [formValues] = useDebounce(watchedValues, 300);

    return (
        <div className="my-3">
            {invoicePdf.size == 0 ? (
                <LivePreview data={formValues as InvoiceType} />
            ) : (
                <FinalPdf />
            )}
        </div>
    );
};

export default PdfViewer;
