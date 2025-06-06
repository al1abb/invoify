"use client";
// Types
import { InvoiceType } from "@/types";
// Next
import dynamic from "next/dynamic";
import { use } from "react";
// RHF
import { useFormContext } from "react-hook-form";

type ViewTemplatePageProps = {
    params: Promise<{ id: string }>;
};

const ViewTemplate = (props: ViewTemplatePageProps) => {
    const params = use(props.params);
    const templateNumber = params.id;

    const DynamicComponent = dynamic<InvoiceType>(
        () =>
            import(
                `@/app/components/templates/invoice-pdf/InvoiceTemplate${templateNumber}`
            )
    );

    const { getValues } = useFormContext();
    const formValues = getValues();

    return (
        <div className="container">
            <DynamicComponent
                sender={formValues.sender}
                receiver={formValues.receiver}
                details={formValues.details}
            />
        </div>
    );
};

export default ViewTemplate;
