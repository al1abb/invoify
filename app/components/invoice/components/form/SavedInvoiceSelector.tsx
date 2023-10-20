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

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Trash2 } from "lucide-react";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { UseFormResetType, ValuesType } from "@/types";

type SavedInvoiceSelectorProps = {
    savedInvoices: ValuesType[];
    deleteInvoice: (id: number) => void;
    onSubmit: (values: ValuesType) => void;
    reset: UseFormResetType;
};

const SavedInvoiceSelector = ({
    savedInvoices,
    deleteInvoice,
    onSubmit,
    reset,
}: SavedInvoiceSelectorProps) => {
    // Update fields when selected invoice is changed.
    // Reason: The fields don't go through validation when invoice loads
    const updateFields = (selected: any) => {
        // Next 2 lines are so that when invoice loads,
        // the dates won't be in the wrong format
        selected.details.dueDate = new Date(selected.details.dueDate);
        selected.details.invoiceDate = new Date(selected.details.invoiceDate);

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

    // Transform date values
    const transformDates = (selected: any) => {
        selected.details.dueDate = new Date(
            selected.details.dueDate
        ).toLocaleDateString(undefined, DATE_OPTIONS);
        selected.details.invoiceDate = new Date(
            selected.details.invoiceDate
        ).toLocaleDateString(undefined, DATE_OPTIONS);
    };

    // Load a saved invoice
    const handleSelectChange = (selectedInvoice: string) => {
        if (selectedInvoice) {
            const selected = JSON.parse(selectedInvoice);
            updateFields(selected);
            reset(selected);
            transformDates(selected);
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
                    {savedInvoices.map((invoice, idx) => (
                        <div className="relative py-2" key={idx}>
                            <SelectItem value={JSON.stringify(invoice)}>
                                {invoice.details.invoiceNumber}
                            </SelectItem>

                            <BaseButton
                                size="icon"
                                variant="destructive"
                                onClick={() => deleteInvoice(idx)}
                                className="absolute top-1 right-0"
                            >
                                <Trash2 />
                            </BaseButton>
                        </div>
                    ))}

                    {savedInvoices.length == 0 && <div>No saved invoices</div>}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SavedInvoiceSelector;
