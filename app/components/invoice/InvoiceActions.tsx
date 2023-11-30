"use client";

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
    const { invoicePdfLoading } = useInvoiceContext();

    return (
        <div className={`xl:w-[45%]`}>
            <Card className="h-auto sticky top-0 px-2">
                <CardHeader>
                    <CardTitle>ACTIONS</CardTitle>
                    <CardDescription>Operations and preview</CardDescription>
                </CardHeader>

                <div className="flex flex-col flex-wrap items-center gap-2">
                    <div className="flex flex-row gap-5">
                        {/* Import & Export modals */}

                        <InvoiceLoaderModal />
                        <InvoiceExportModal />
                    </div>

                    <div className="flex flex-row gap-5">
                        <NewInvoiceAlert>
                            <BaseButton
                                tooltipLabel="Get a new invoice form"
                                variant="outline"
                                disabled={invoicePdfLoading}
                            >
                                <Plus />
                                New Invoice
                            </BaseButton>
                        </NewInvoiceAlert>

                        <BaseButton
                            type="submit"
                            tooltipLabel="Generate your invoice"
                            loading={invoicePdfLoading}
                            loadingText="Generating your invoice"
                        >
                            <FileInput />
                            Generate PDF
                        </BaseButton>
                    </div>

                    <PdfViewer />
                </div>
            </Card>
        </div>
    );
};

export default InvoiceActions;
