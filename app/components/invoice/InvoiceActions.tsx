"use client";

import React from "react";

// ShadCn
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Components
import {
    PdfViewer,
    BaseButton,
    NewInvoiceAlert,
    InvoiceLoaderModal,
    InvoiceExportModal,
} from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/app/contexts/InvoiceContext";

// Icons
import { FileInput, Plus } from "lucide-react";

type InvoiceActionsProps = {};

const InvoiceActions = ({}: InvoiceActionsProps) => {
    const { invoicePdfLoading, invoicePdf } = useInvoiceContext();

    return (
        <div className={`w-full xl:w-[29%]`}>
            <Card className="h-[100vh] sticky top-0 px-2">
                <CardHeader>
                    <CardTitle>ACTIONS</CardTitle>
                    <CardDescription>Operations and preview</CardDescription>
                </CardHeader>

                <div className="flex flex-col flex-wrap gap-2">
                    <div className="flex flex-row gap-5">
                        {/* Import & Export modals */}

                        <InvoiceLoaderModal />
                        <InvoiceExportModal />
                    </div>

                    <NewInvoiceAlert>
                        <BaseButton
                            tooltipLabel="Get new invoice form"
                            variant="outline"
                            disabled={invoicePdfLoading}
                        >
                            <Plus />
                            New Invoice
                        </BaseButton>
                    </NewInvoiceAlert>

                    <BaseButton
                        type="submit"
                        size="lg"
                        tooltipLabel="Generate your invoice"
                        loading={invoicePdfLoading}
                        loadingText="Generating your invoice"
                    >
                        <FileInput />
                        <span>Generate PDF</span>
                    </BaseButton>

                    <div>
                        {!invoicePdfLoading && invoicePdf.size != 0 && (
                            <PdfViewer pdfBlob={invoicePdf} />
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InvoiceActions;
