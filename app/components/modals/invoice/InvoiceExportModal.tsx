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
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Icons
import { Import } from "lucide-react";

// Types
import { ExportTypes } from "@/types";

const InvoiceExportModal = () => {
    const [open, setOpen] = useState(false);

    const { invoicePdfLoading, exportInvoiceAs } = useInvoiceContext();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <BaseButton
                    variant="outline"
                    tooltipLabel="Open load invoice menu"
                    disabled={invoicePdfLoading}
                >
                    <Import />
                    Export Invoice
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

                <div className="flex flex-wrap flex-row gap-5">
                    <BaseButton
                        tooltipLabel="Export Invoice as JSON"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.JSON)}
                    >
                        Export as JSON
                    </BaseButton>
                    <BaseButton
                        tooltipLabel="Export Invoice as CSV"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.CSV)}
                    >
                        Export as CSV
                    </BaseButton>

                    <BaseButton
                        tooltipLabel="Export Invoice as XML"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.XML)}
                    >
                        Export as XML
                    </BaseButton>

                    <BaseButton
                        tooltipLabel="Export Invoice as XLSX"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.XLSX)}
                    >
                        Export as XLSX
                    </BaseButton>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceExportModal;
