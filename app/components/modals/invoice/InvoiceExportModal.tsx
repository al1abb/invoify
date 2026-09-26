"use client";

import { useState } from "react";

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
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { ExportTypes } from "@/types";

type InvoiceExportModalType = {
    children: React.ReactNode;
};

const InvoiceExportModal = ({ children }: InvoiceExportModalType) => {
    const [open, setOpen] = useState(false);

    const { invoicePdfLoading, exportInvoiceAs } = useInvoiceContext();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export the invoice</DialogTitle>
                    <DialogDescription>
                        Please select export option for your invoice
                    </DialogDescription>
                </DialogHeader>

                {/* Export options here */}

                {/*
                 * XLSX is deliberately absent: the server-side case for it has
                 * been commented out, so the button only ever produced an
                 * error. See the note in exportInvoiceService.
                 */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <BaseButton
                        tooltipLabel="Export Invoice as JSON"
                        variant="outline"
                        className="w-full"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.JSON)}
                    >
                        JSON
                    </BaseButton>
                    <BaseButton
                        tooltipLabel="Export Invoice as CSV"
                        variant="outline"
                        className="w-full"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.CSV)}
                    >
                        CSV
                    </BaseButton>

                    <BaseButton
                        tooltipLabel="Export Invoice as XML"
                        variant="outline"
                        className="w-full"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.XML)}
                    >
                        XML
                    </BaseButton>

                    <BaseButton
                        tooltipLabel="Export as XRechnung (German B2G e-invoice, UBL syntax)"
                        variant="outline"
                        className="w-full"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.XRECHNUNG)}
                    >
                        XRechnung
                    </BaseButton>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceExportModal;
