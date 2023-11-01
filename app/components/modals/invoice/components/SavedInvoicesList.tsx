"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Components
import { BaseButton } from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Icons
import { FileText, Trash2 } from "lucide-react";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/app/types/types";

type SavedInvoicesListProps = {
    setModalState: React.Dispatch<React.SetStateAction<boolean>>;
};

const SavedInvoicesList = ({ setModalState }: SavedInvoicesListProps) => {
    const { savedInvoices, onFormSubmit, deleteInvoice } = useInvoiceContext();

    const { reset } = useFormContext<InvoiceType>();

    // Update fields when selected invoice is changed.
    // ? Reason: The fields don't go through validation when invoice loads
    const updateFields = (selected: any) => {
        // Next 2 lines are so that when invoice loads,
        // the dates won't be in the wrong format
        // ? Selected cannot be of type InvoiceType because of these 2 variables
        selected.details.dueDate = new Date(selected.details.dueDate);
        selected.details.invoiceDate = new Date(selected.details.invoiceDate);

        selected.details.invoiceLogo = "";
        selected.details.signature = {
            data: "",
        };

        selected.details.subTotal = formatNumberWithCommas(
            Number(selected.details.subTotal)
        );
        selected.details.totalAmount = formatNumberWithCommas(
            Number(selected.details.totalAmount)
        );
    };

    // Transform date values for next submission
    const transformDates = (selected: InvoiceType) => {
        selected.details.dueDate = new Date(
            selected.details.dueDate
        ).toLocaleDateString(undefined, DATE_OPTIONS);
        selected.details.invoiceDate = new Date(
            selected.details.invoiceDate
        ).toLocaleDateString(undefined, DATE_OPTIONS);
    };

    // Load a saved invoice
    const handleSelect = (selectedInvoice: InvoiceType) => {
        if (selectedInvoice) {
            updateFields(selectedInvoice);
            reset(selectedInvoice);
            transformDates(selectedInvoice);

            // Submit form
            onFormSubmit(selectedInvoice);

            // Close modal
            setModalState(false);
        }
    };

    return (
        <div>
            <Label className="text-md">Your Invoices:</Label>

            <div className="flex flex-wrap gap-4 py-5 overflow-y-auto max-h-72">
                {savedInvoices.map((invoice, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-md border border-black hover:border-blue-500 hover:shadow-lg w-52 cursor-pointer"
                        onClick={() => handleSelect(invoice)}
                    >
                        <div className="text-lg font-semibold">
                            <FileText size={20} />
                            <Badge variant="secondary" className="">
                                <p style={{ fontSize: "16px" }}>
                                    #{invoice.details.invoiceNumber}
                                </p>
                            </Badge>
                        </div>
                        <small>{invoice.details.updatedAt}</small>
                        <div className="text-gray-600">
                            <p>From: {invoice.sender.name}</p>
                            <p>To: {invoice.receiver.name}</p>
                            <p>
                                Total: <b>${invoice.details.totalAmount}</b>
                            </p>
                        </div>

                        {/* Remove Invoice Button */}
                        <BaseButton
                            className="mt-3"
                            size="icon"
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteInvoice(idx);
                            }}
                        >
                            <Trash2 className="mr-1" />
                        </BaseButton>
                    </div>
                ))}

                {savedInvoices.length == 0 && (
                    <div>
                        <p>No saved invoices</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedInvoicesList;
