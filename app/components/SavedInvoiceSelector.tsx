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
    const updateFields = (selected: any) => {
        selected.details.dueDate = new Date(selected.details.dueDate);
        selected.details.invoiceDate = new Date(selected.details.invoiceDate);
        selected.details.invoiceLogo = "";
        selected.details.signature = "";
    };

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
