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
import { PdfViewer } from "..";

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
    sendPdfToMail: (mail: string) => void;
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
                <div className="flex flex-col px-6 gap-y-1">
                    <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={newInvoice}
                    >
                        <Plus />
                        New Invoice
                    </Button>
                    <Button
                        type="submit"
                        className="gap-2"
                        disabled={invoicePdfLoading}
                    >
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
                                    <Button
                                        type="button"
                                        onClick={() => previewPdfInTab()}
                                        size="icon"
                                    >
                                        <Eye />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => downloadPdf()}
                                        size="icon"
                                    >
                                        <Download />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => savePdf()}
                                        size="icon"
                                    >
                                        <Save />
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() =>
                                            sendPdfToMail("some-mail@gmail.com")
                                        }
                                        size="icon"
                                    >
                                        <Mail />
                                    </Button>
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
