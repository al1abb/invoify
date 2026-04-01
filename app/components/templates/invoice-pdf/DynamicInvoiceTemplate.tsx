"use client";

// ShadCn
import { Skeleton } from "@/components/ui/skeleton";
// Types
import { InvoiceType } from "@/types";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

const DynamicInvoiceTemplateSkeleton = () => {
    return <Skeleton className="min-h-[60rem]" />;
};

const DynamicInvoiceTemplate = (props: InvoiceType) => {
    // Dynamic preview component name
    const previewName = `InvoicePreview${props.details.pdfTemplate}`;

    const DynamicInvoice = useMemo(
        () =>
            dynamic<InvoiceType>(
                () =>
                    import(
                        `@/app/components/templates/invoice-pdf/${previewName}`
                    ),
                {
                    loading: () => <DynamicInvoiceTemplateSkeleton />,
                    ssr: false,
                }
            ),
        [previewName]
    );

    return <DynamicInvoice {...props} />;
};

export default DynamicInvoiceTemplate;
