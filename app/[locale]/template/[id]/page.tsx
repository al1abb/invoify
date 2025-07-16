"use client";

// Next
import dynamic from "next/dynamic";

// RHF
import { useFormContext } from "react-hook-form";
import { use } from "react";

// Types
import { InvoiceType } from "@/types";

const ViewTemplate = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: templateNumber } = use(params);

  const DynamicComponent = dynamic<InvoiceType>(
    () =>
      import(
        `@/app/components/templates/invoice-pdf/InvoiceTemplate${templateNumber}`
      ),
  );

  const { getValues } = useFormContext();
  const formValues = getValues();

  return (
    <div className="container mx-auto">
      <DynamicComponent
        sender={formValues.sender}
        receiver={formValues.receiver}
        details={formValues.details}
      />
    </div>
  );
};

export default ViewTemplate;
