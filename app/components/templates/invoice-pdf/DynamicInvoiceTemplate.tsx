import dynamic from "next/dynamic";

import React, { useMemo } from "react";

// ShadCn
import { Skeleton } from "@/components/ui/skeleton";

// Types
import { InvoiceType } from "@/types";

const DynamicInvoiceTemplateSkeleton = () => {
    return <Skeleton className="w-full min-h-[65rem]" />;
};

const DynamicInvoiceTemplate = (props: InvoiceType) => {
    // Dynamic template component name
    const templateName = `InvoiceTemplate${props.details.pdfTemplate}`;

    const DYNAMIC = useMemo(
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

    return <DYNAMIC {...props} />;
};

export default DynamicInvoiceTemplate;
