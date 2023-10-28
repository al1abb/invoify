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
import { BaseButton } from "@/app/components";

// Context
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Icons
import { Import } from "lucide-react";

type InvoiceExportModalProps = {};

const InvoiceExportModal = (props: InvoiceExportModalProps) => {
    const [open, setOpen] = useState(false);

    const { invoicePdfLoading, exportInvoice } = useInvoiceContext();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <BaseButton
                    variant="outline"
                    tooltipLabel="Open load invoice menu"
                    className="flex gap-2 w-auto"
                    disabled={invoicePdfLoading}
                >
                    <Import />
                    Export invoice
                </BaseButton>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export the invoice</DialogTitle>
                    <DialogDescription>
                        Please select export option for your invoice
                    </DialogDescription>
                </DialogHeader>

                {/* Export options here */}

                <BaseButton
                    tooltipLabel="Export Invoice as JSON"
                    disabled={invoicePdfLoading}
                    onClick={() => exportInvoice("JSON")}
                >
                    Export as JSON
                </BaseButton>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceExportModal;
