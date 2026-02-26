"use client";

import dynamic from "next/dynamic";
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Components
import BaseButton from "@/app/components/reusables/BaseButton";
import PdfViewer from "@/app/components/invoice/actions/PdfViewer";
import SyncStatusIndicator from "@/app/components/invoice/actions/SyncStatusIndicator";
import SyncDiagnosticsModal from "@/app/components/invoice/actions/SyncDiagnosticsModal";
import SyncConflictsModal from "@/app/components/invoice/actions/SyncConflictsModal";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";
import {
  normalizeDocumentType,
  toInvoiceNumberFromQuote,
} from "@/lib/invoice/documentType";
import { InvoiceType } from "@/types";

// Icons
import {
  FileInput,
  FolderUp,
  Import,
  Plus,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";

const NewInvoiceAlert = dynamic(
  () => import("@/app/components/modals/alerts/NewInvoiceAlert"),
  { ssr: false }
);

const InvoiceLoaderModal = dynamic(
  () => import("@/app/components/modals/invoice/InvoiceLoaderModal"),
  { ssr: false }
);

const InvoiceExportModal = dynamic(
  () => import("@/app/components/modals/invoice/InvoiceExportModal"),
  { ssr: false }
);

const InvoiceActions = () => {
  const { invoicePdfLoading, newInvoice, removeFinalPdf } = useInvoiceContext();
  const { _t } = useTranslationContext();
  const { control, getValues, setValue } = useFormContext<InvoiceType>();
  const documentType = useWatch({
    control,
    name: "details.documentType",
  });
  const isQuote = normalizeDocumentType(documentType) === "quote";

  const convertToInvoice = () => {
    const invoiceNumber = getValues("details.invoiceNumber") || "";
    const convertedInvoiceNumber = toInvoiceNumberFromQuote(invoiceNumber);

    setValue("details.documentType", "invoice", {
      shouldDirty: true,
      shouldTouch: true,
    });

    if (convertedInvoiceNumber !== invoiceNumber) {
      setValue("details.invoiceNumber", convertedInvoiceNumber, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    removeFinalPdf();
  };

  return (
    <div className={`xl:w-[45%]`}>
      <Card className="h-auto sticky top-0 px-2">
        <CardHeader>
          <CardTitle>{_t("actions.title")}</CardTitle>
          <CardDescription>{_t("actions.description")}</CardDescription>
        </CardHeader>

        <div className="flex flex-col flex-wrap items-center gap-2">
          <SyncStatusIndicator />
          <div className="w-full flex justify-end gap-2">
            <SyncConflictsModal />
            <SyncDiagnosticsModal />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Load modal button */}
            <InvoiceLoaderModal>
              <BaseButton
                variant="outline"
                tooltipLabel="Open load invoice menu"
                disabled={invoicePdfLoading}
                data-testid="load-invoice-btn"
              >
                <FolderUp />
                {_t("actions.loadInvoice")}
              </BaseButton>
            </InvoiceLoaderModal>

            {/* Export modal button */}
            <InvoiceExportModal>
              <BaseButton
                variant="outline"
                tooltipLabel="Open load invoice menu"
                disabled={invoicePdfLoading}
                data-testid="export-invoice-btn"
              >
                <Import />
                {_t("actions.exportInvoice")}
              </BaseButton>
            </InvoiceExportModal>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* New invoice button */}
            <NewInvoiceAlert>
              <BaseButton
                variant="outline"
                tooltipLabel="Get a new invoice form"
                disabled={invoicePdfLoading}
                data-testid="new-invoice-btn"
              >
                <Plus />
                {_t("actions.newInvoice")}
              </BaseButton>
            </NewInvoiceAlert>

            {isQuote ? (
              <BaseButton
                variant="outline"
                tooltipLabel="Convert quote to invoice"
                disabled={invoicePdfLoading}
                onClick={convertToInvoice}
                data-testid="convert-to-invoice-btn"
              >
                <RefreshCcw />
                {_t("actions.convertToInvoice")}
              </BaseButton>
            ) : null}

            {/* Reset form button */}
            <NewInvoiceAlert
              title={_t("actions.resetFormTitle")}
              description={_t("actions.resetFormDescription")}
              confirmLabel={_t("actions.resetFormConfirm")}
              onConfirm={newInvoice}
            >
              <BaseButton
                variant="destructive"
                tooltipLabel="Reset entire form"
                disabled={invoicePdfLoading}
                data-testid="reset-form-btn"
              >
                <RotateCcw />
                {_t("actions.resetForm")}
              </BaseButton>
            </NewInvoiceAlert>

            {/* Generate pdf button */}
            <BaseButton
              type="submit"
              tooltipLabel={
                isQuote ? "Generate your quote" : "Generate your invoice"
              }
              loading={invoicePdfLoading}
              loadingText={
                isQuote ? "Generating your quote" : "Generating your invoice"
              }
              data-testid="generate-pdf-btn"
            >
              <FileInput />
              {_t("actions.generatePdf")}
            </BaseButton>
          </div>

          <div className="w-full">
            {/* Live preview and Final pdf */}
            <PdfViewer />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceActions;
