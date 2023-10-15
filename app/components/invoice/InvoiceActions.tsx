"use client";
import React from "react";

// Shadcn
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Lucide Icons
import {
    Download,
    Eye,
    FileInput,
    Loader2,
    Mail,
    Plus,
    Save,
} from "lucide-react";

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
    const newInvoice = () => {
        reset(FORM_DEFAULT_VALUES);
    };
    return (
        <div className="w-full xl:w-1/4">
            <Card className="sticky top-0">
                <CardHeader>
                    <CardTitle>ACTIONS</CardTitle>
                    <CardDescription>Operations and preview</CardDescription>
                </CardHeader>
                <div className="flex flex-col px-2 gap-y-1">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={newInvoice}
                    >
                        <Plus />
                        New Invoice
                    </Button>
                    <Button type="submit" disabled={invoicePdfLoading}>
                        {invoicePdfLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            <>
                                <FileInput />
                                <span>Generate PDF</span>
                            </>
                        )}
                    </Button>

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
