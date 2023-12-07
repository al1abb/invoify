import React, { useMemo } from "react";

import dynamic from "next/dynamic";

// ShadCn
import { Skeleton } from "@/components/ui/skeleton";

// Types
import { InvoiceType } from "@/types";

const DynamicInvoiceTemplateSkeleton = () => {
    return <Skeleton className="min-h-[60rem]" />;
};

const DynamicInvoiceTemplate = (props: InvoiceType) => {
    // Dynamic template component name
    const templateName = `InvoiceTemplate${props.details.pdfTemplate}`;

    const DynamicInvoice = useMemo(
        () =>
            dynamic<InvoiceType>(
                () =>
                    import(
                        `@/app/components/templates/invoice-pdf/${templateName}`
                    ),
                {
                    loading: () => <DynamicInvoiceTemplateSkeleton />,
                    ssr: false,
                }
            ),
        [templateName]
    );

    return <DynamicInvoice {...props} />;
};

export default DynamicInvoiceTemplate;
