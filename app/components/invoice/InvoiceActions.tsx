"use client";
import React from "react";

import { useRouter } from "next/navigation";

// Shadcn
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Lucide Icons
import { Download, Eye, FileInput, Plus, Save } from "lucide-react";

// Components
import { PdfViewer, BaseButton, SendPdfToEmailModal } from "@/app/components";

// Types
import { UseFormResetType } from "@/types";

// Variables
import { FORM_DEFAULT_VALUES } from "@/lib/variables";

type InvoiceActionsProps = {
    invoicePdfLoading: boolean;
    invoicePdf: Blob;
    downloadPdf: () => void;
    previewPdfInTab: () => void;
    savePdf: () => void;
    sendPdfToMail: (email: string) => Promise<void>;
    reset: UseFormResetType;
};

const InvoiceActions = ({
    invoicePdfLoading,
    invoicePdf,
    downloadPdf,
    previewPdfInTab,
    savePdf,
    sendPdfToMail,
    reset,
}: InvoiceActionsProps) => {
    const router = useRouter();

    const newInvoice = () => {
        reset(FORM_DEFAULT_VALUES);
        router.refresh();
    };
    return (
        <div className="w-full xl:w-1/4">
            <Card className="sticky top-0">
                <CardHeader>
                    <CardTitle>ACTIONS</CardTitle>
                    <CardDescription>Operations and preview</CardDescription>
                </CardHeader>
                <div className="flex flex-col px-2 gap-y-1">
                    <BaseButton
                        tooltipLabel="Get new invoice form"
                        variant="outline"
                        onClick={newInvoice}
                        disabled={invoicePdfLoading}
                    >
                        <Plus />
                        New Invoice
                    </BaseButton>
                    <BaseButton
                        type="submit"
                        tooltipLabel="Generate your invoice"
                        loading={invoicePdfLoading}
                        loadingText="Generating your invoice"
                    >
                        <FileInput />
                        <span>Generate PDF</span>
                    </BaseButton>

                    <div>
                        {!invoicePdfLoading && invoicePdf.size != 0 && (
                            <div>
                                <PdfViewer pdfBlob={invoicePdf} />
                                <div className="flex flex-row gap-2 py-3">
                                    <BaseButton
                                        tooltipLabel="Preview invoice in new tab"
                                        onClick={previewPdfInTab}
                                        size="icon"
                                    >
                                        <Eye />
                                    </BaseButton>
                                    <BaseButton
                                        tooltipLabel="Download invoice PDF"
                                        onClick={downloadPdf}
                                        size="icon"
                                    >
                                        <Download />
                                    </BaseButton>
                                    <BaseButton
                                        tooltipLabel="Save invoice in website"
                                        onClick={savePdf}
                                        size="icon"
                                    >
                                        <Save />
                                    </BaseButton>

                                    <SendPdfToEmailModal
                                        sendPdfToMail={sendPdfToMail}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InvoiceActions;
