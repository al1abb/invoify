"use client";

// Debounce
import { useDebounce } from "use-debounce";

// RHF
import { useFormContext } from "react-hook-form";

// Components
import { FinalPdf, LivePreview } from "@/app/components";

// Helpers
import { cleanInvoiceItemsForSettings } from "@/lib/helpers";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useSettings } from "@/contexts/SettingsContext";

// Types
import { InvoiceType } from "@/types";

const PdfViewer = () => {
    const { invoicePdf } = useInvoiceContext();
    const { settings } = useSettings();

    const { watch } = useFormContext<InvoiceType>();

    const [debouncedWatch] = useDebounce(watch, 1000);
    const formValues = debouncedWatch();

    // Clean data based on settings - remove discount/tax if settings are disabled
    const cleanedData = {
        ...formValues,
        details: {
            ...formValues.details,
            items: cleanInvoiceItemsForSettings(formValues.details.items, settings),
        },
    };

    return (
        <div className="my-3">
            {invoicePdf.size == 0 ? (
                <LivePreview data={cleanedData} />
            ) : (
                <FinalPdf />
            )}
        </div>
    );
};

export default PdfViewer;
