"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Components
import { BaseButton } from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/app/types/types";
import { Card, CardContent } from "@/components/ui/card";

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
        <>
            <div className="flex flex-col gap-5 overflow-y-auto max-h-72">
                {savedInvoices.map((invoice, idx) => (
                    <Card
                        key={idx}
                        className="p-2 border rounded-sm hover:border-blue-500 hover:shadow-lg cursor-pointer"
                        onClick={() => handleSelect(invoice)}
                    >
                        <CardContent className="flex justify-between">
                            <div>
                                {/* <FileText /> */}
                                <p className="font-semibold">
                                    Invoice #{invoice.details.invoiceNumber}{" "}
                                </p>
                                <small className="text-gray-500">
                                    Updated at: {invoice.details.updatedAt}
                                </small>

                                <div>
                                    <p>Sender: {invoice.sender.name}</p>
                                    <p>Receiver: {invoice.receiver.name}</p>
                                    <p>
                                        Total:
                                        <span className="font-semibold">
                                            {invoice.details.totalAmount}{" "}
                                            {invoice.details.currency}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2">
                                {/* Remove Invoice Button */}
                                <BaseButton
                                    variant="destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteInvoice(idx);
                                    }}
                                >
                                    Delete
                                </BaseButton>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {savedInvoices.length == 0 && (
                    <div>
                        <p>No saved invoices</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default SavedInvoicesList;
