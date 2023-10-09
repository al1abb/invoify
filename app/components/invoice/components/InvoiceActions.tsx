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
import { Download, Eye, FileInput, Loader2, Save } from "lucide-react";

// Components
import { PdfViewer } from "../..";

type InvoiceActionsProps = {
    invoicePdfLoading: boolean;
    invoicePdf: Blob;
    downloadPdf: () => void;
    previewPdfInTab: () => void;
    savePdf: () => void;
};

const InvoiceActions = ({
    invoicePdfLoading,
    invoicePdf,
    downloadPdf,
    previewPdfInTab,
    savePdf,
}: InvoiceActionsProps) => {
    return (
        <div className="w-full xl:w-1/4">
            <Card className="sticky top-0">
                <CardHeader>
                    <CardTitle>ACTIONS</CardTitle>
                    <CardDescription>Operations and preview</CardDescription>
                </CardHeader>
                <div className="flex flex-col px-6 py-3 gap-y-1">
                    <Button
                        type="submit"
                        className="w-fit gap-2"
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
