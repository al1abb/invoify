"use client";

import { useMemo } from "react";

import dynamic from "next/dynamic";

// ShadCn
import { Skeleton } from "@/components/ui/skeleton";

// Types
import { InvoiceTypeWithPreview } from "@/types";

const DynamicInvoiceTemplateSkeleton = () => {
  return <Skeleton className="min-h-[60rem]" />;
};

const DynamicInvoiceTemplate = (props: InvoiceTypeWithPreview) => {
  // Dynamic template component name
  const templateName = `InvoiceTemplate${props.details.pdfTemplate}`;

  const DynamicInvoice = useMemo(
    () =>
      dynamic<InvoiceTypeWithPreview>(
        () => import(`@/app/components/templates/invoice-pdf/${templateName}`),
        {
          loading: () => <DynamicInvoiceTemplateSkeleton />,
          ssr: false,
        }
      ),
    [templateName]
  );

  return <DynamicInvoice {...props} isPreview={true} />;
};

export default DynamicInvoiceTemplate;
