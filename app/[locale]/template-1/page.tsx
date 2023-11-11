"use client";

import React from "react";
import { InvoiceTemplate } from "@/app/components";
import { useFormContext } from "react-hook-form";

type Props = {};

const Template1 = (props: Props) => {
    const { getValues } = useFormContext();

    const formValues = getValues();
    return (
        <div className="container">
            <InvoiceTemplate
                sender={formValues.sender}
                receiver={formValues.receiver}
                details={formValues.details}
            />
        </div>
    );
};

export default Template1;
