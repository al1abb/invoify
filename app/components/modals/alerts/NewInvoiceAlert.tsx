"use client";

import React, { useState } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Context
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// ShadCn
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type NewInvoiceAlertProps = {
    children: React.ReactNode;
};

const NewInvoiceAlert = ({ children }: NewInvoiceAlertProps) => {
    // Invoice context
    const { newInvoice } = useInvoiceContext();

    const {
        formState: { isDirty },
    } = useFormContext();

    const [open, setOpen] = useState(false);

    const handleNewInvoice = () => {
        if (isDirty) {
            // If the form is dirty, show the alert dialog
            setOpen(true);
        } else {
            // If the form is not dirty, call the newInvoice function from context
            newInvoice();
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. You might lose your
                            data if you have unsaved changes
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={newInvoice}>
                            Create new invoice
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Not for showing div and instead showing the whole button */}
            {React.cloneElement(children as React.ReactElement, {
                onClick: handleNewInvoice,
            })}
        </>
    );
};

export default NewInvoiceAlert;
