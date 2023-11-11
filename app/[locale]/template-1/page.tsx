"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Components
import { InvoiceTemplate1 } from "@/app/components";

type Props = {};

const Template1 = (props: Props) => {
    const { getValues } = useFormContext();

    const formValues = getValues();
    return (
        <div className="container">
            <InvoiceTemplate1
                sender={formValues.sender}
                receiver={formValues.receiver}
                details={formValues.details}
            />
        </div>
    );
};

export default Template1;
