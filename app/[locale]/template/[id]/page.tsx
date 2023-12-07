"use client";

// Next
import dynamic from "next/dynamic";

// RHF
import { useFormContext } from "react-hook-form";

// Types
import { InvoiceType } from "@/types";

type ViewTemplatePageProps = {
    params: { id: string };
};

const ViewTemplate = ({ params }: ViewTemplatePageProps) => {
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
