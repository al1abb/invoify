"use client";

import React from "react";

// Shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Formatter
import { formatNumberWithCommas } from "@/lib/formatter";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { UseFormResetType, ValuesType } from "@/types";

type SavedInvoiceSelectorProps = {
    savedInvoices: ValuesType[];
    onSubmit: (values: ValuesType) => void;
    reset: UseFormResetType;
};

const SavedInvoiceSelector = ({
    savedInvoices,
    onSubmit,
    reset,
}: SavedInvoiceSelectorProps) => {
    // Update fields
    const updateFields = (selected: any) => {
        selected.details.dueDate = new Date(
            selected.details.dueDate
        ).toLocaleDateString(undefined, DATE_OPTIONS);
        selected.details.invoiceDate = new Date(
            selected.details.invoiceDate
        ).toLocaleDateString(undefined, DATE_OPTIONS);

        selected.details.invoiceLogo = "";
        selected.details.signature = "";

        selected.details.subTotal = formatNumberWithCommas(
            Number(selected.details.subTotal)
        );
        selected.details.totalAmount = formatNumberWithCommas(
            Number(selected.details.totalAmount)
        );

        //? Might work if image input logic is moved to a separate hook
        // Invoice logo
        // const logoImage = document.getElementById(
        //     "logoImage"
        // ) as HTMLImageElement;

        // console.log(logoImage);

        // if (logoImage) {
        //     logoImage.src = selected.details.invoiceLogo;
        // }
    };

    // Load saved invoice
    const handleSelectChange = (selectedInvoice: string) => {
        if (selectedInvoice) {
            const selected = JSON.parse(selectedInvoice);
            updateFields(selected);
            reset(selected);
            onSubmit(selected);
        }
    };

    return (
        <div className="my-4">
            <Label>Saved Invoices</Label>
            <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Load a saved invoice" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">Choose Item</SelectItem>
                    {savedInvoices.map((invoice, idx) => (
                        <SelectItem key={idx} value={JSON.stringify(invoice)}>
                            {invoice.details.invoiceNumber}
                        </SelectItem>
                    ))}

                    {savedInvoices.length == 0 && <div>No saved invoices</div>}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SavedInvoiceSelector;
