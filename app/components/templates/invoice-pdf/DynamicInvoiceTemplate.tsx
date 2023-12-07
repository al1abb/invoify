"use client";

import React, { useEffect, useState } from "react";

// ShadCn
import { Skeleton } from "@/components/ui/skeleton";

// Types
import { InvoiceType } from "@/types";

const DynamicInvoiceTemplateSkeleton = () => {
    return <Skeleton className="w-full min-h-[65rem]" />;
};

const DynamicInvoiceTemplate = (props: InvoiceType) => {
    // State to store the dynamically imported component
    const [DynamicTemplate, setDynamicTemplate] =
        useState<React.ComponentType<InvoiceType> | null>(null);

    // Dynamic template component name
    const templateName = `InvoiceTemplate${props.details.pdfTemplate}`;

    // * This useEffect fires only when template changes
    useEffect(() => {
        // Import the component dynamically
        const importPromise = import(
            `@/app/components/templates/invoice-pdf/${templateName}`
        );

        importPromise
            .then((module) => {
                setDynamicTemplate(() => module.default);
            })
            .catch((error) => {
                console.error(
                    `Error importing template ${templateName}: ${error}`
                );
            });
    }, [templateName]);

    if (!DynamicTemplate) {
        // Loading state or fallback component
        return <DynamicInvoiceTemplateSkeleton />;
    }

    return <DynamicTemplate {...props} />;
};

export default DynamicInvoiceTemplate;
