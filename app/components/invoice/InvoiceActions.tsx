"use client";
import React, { useMemo } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Shadcn
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
    SendPdfToEmailModal,
    NewInvoiceAlert,
    InvoiceLoaderModal,
    InvoiceExportModal,
} from "@/app/components";

// Icons
import { Download, Eye, FileInput, Mail, Plus, Save } from "lucide-react";

type InvoiceActionsProps = {
    invoicePdfLoading: boolean;
    invoicePdf: Blob;
    downloadPdf: () => void;
    previewPdfInTab: () => void;
    saveInvoice: () => void;
    sendPdfToMail: (email: string) => Promise<void>;
};

const InvoiceActions = ({
    invoicePdfLoading,
    invoicePdf,
    downloadPdf,
    previewPdfInTab,
    saveInvoice,
    sendPdfToMail,
}: InvoiceActionsProps) => {
    return (
        <div className={`w-full xl:w-[29%]`}>
            <Card className="sticky top-0 px-2">
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
                </div>
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
                                    onClick={saveInvoice}
                                    size="icon"
                                >
                                    <Save />
                                </BaseButton>

                                <SendPdfToEmailModal
                                    sendPdfToMail={sendPdfToMail}
                                >
                                    <BaseButton
                                        tooltipLabel="Send invoice PDF to mail"
                                        size="icon"
                                    >
                                        <Mail />
                                    </BaseButton>
                                </SendPdfToEmailModal>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default InvoiceActions;
