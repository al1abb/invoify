"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Shadcn
import { Label } from "@/components/ui/label";

// Components
import {
    CurrencySelector,
    DatePickerFormField,
    InputFormField,
} from "@/app/components";

type InvoiceDetailsProps = {};

const InvoiceDetails = (props: InvoiceDetailsProps) => {
    const { control } = useFormContext();

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="invoiceDetails" className="text-xl font-semibold">
                Invoice Details:
            </Label>

            <InputFormField
                control={control}
                name="details.invoiceNumber"
                label="Invoice number"
                placeholder="Invoice number"
            />

            <DatePickerFormField
                control={control}
                name="details.invoiceDate"
                label="Issued date"
            />

            <DatePickerFormField
                control={control}
                name="details.dueDate"
                label="Due date"
            />

            <CurrencySelector
                control={control}
                name="details.currency"
                label="Currency"
                placeholder="Select Currency"
            />
        </div>
    );
};

export default InvoiceDetails;
