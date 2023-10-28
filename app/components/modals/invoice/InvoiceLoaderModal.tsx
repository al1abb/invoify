"use client";

import React, { useState } from "react";

// ShadCn
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Components
import { BaseButton, SavedInvoicesList } from "@/app/components";

// Context
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Icons
import { FolderUp } from "lucide-react";

type InvoiceLoaderModalProps = {};

const InvoiceLoaderModal = (props: InvoiceLoaderModalProps) => {
    const [open, setOpen] = useState(false);

    const { invoicePdfLoading } = useInvoiceContext();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <BaseButton
                    variant="outline"
                    tooltipLabel="Open load invoice menu"
                    className="flex gap-2 w-auto"
                    disabled={invoicePdfLoading}
                >
                    <FolderUp />
                    Load invoice
                </BaseButton>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Load an invoice</DialogTitle>
                    <DialogDescription>
                        Please select an invoice to load.
                    </DialogDescription>
                </DialogHeader>

                <SavedInvoicesList setModalState={setOpen} />
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceLoaderModal;
