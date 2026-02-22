"use client";

import React from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Components
import { BaseButton } from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers/client";

// Types
import { InvoiceType, SavedInvoiceRecord } from "@/types";

type SavedInvoicesListProps = {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
};

const toDisplayStatus = (status: SavedInvoiceRecord["status"]) => {
  switch (status) {
    case "paid":
      return { labelKey: "savedInvoices.status.paid", variant: "default" as const };
    case "sent":
      return { labelKey: "savedInvoices.status.sent", variant: "secondary" as const };
    default:
      return {
        labelKey: "savedInvoices.status.draft",
        variant: "outline" as const,
      };
  }
};

type InvoiceFormCompatible = Omit<InvoiceType, "details"> & {
  details: Omit<InvoiceType["details"], "dueDate" | "invoiceDate"> & {
    dueDate: Date | string;
    invoiceDate: Date | string;
  };
};

const toDate = (value: unknown) => {
  const parsed = new Date(String(value ?? ""));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const normalizeInvoiceForForm = (invoice: InvoiceType) => {
  const normalized = JSON.parse(JSON.stringify(invoice)) as InvoiceFormCompatible;

  normalized.details.dueDate = toDate(normalized.details.dueDate);
  normalized.details.invoiceDate = toDate(normalized.details.invoiceDate);

  normalized.details.invoiceLogo = "";
  normalized.details.signature = {
    data: "",
  };

  return normalized as unknown as InvoiceType;
};

const formatCacheSize = (sizeBytes: number) => {
  if (sizeBytes < 1024) return `${sizeBytes} B`;

  const kb = sizeBytes / 1024;
  if (kb < 1024) return `${Math.ceil(kb)} KB`;

  return `${(kb / 1024).toFixed(1)} MB`;
};

const toInvoiceTestId = (invoiceNumber: string) => {
  return invoiceNumber.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};

const SavedInvoicesList = ({ setModalState }: SavedInvoicesListProps) => {
  const {
    savedInvoices,
    onFormSubmit,
    deleteInvoice,
    duplicateInvoice,
    updateSavedInvoiceStatus,
    restorePdfFromCache,
    getCachedPdfMeta,
  } = useInvoiceContext();

  const { reset } = useFormContext<InvoiceType>();
  const { _t } = useTranslationContext();

  const loadInvoice = async (record: SavedInvoiceRecord) => {
    const normalized = normalizeInvoiceForForm(record.data);

    reset(normalized);
    await restorePdfFromCache(record.invoiceNumber);

    setModalState(false);
  };

  const loadAndGeneratePdf = async (record: SavedInvoiceRecord) => {
    const normalized = normalizeInvoiceForForm(record.data);

    reset(normalized);

    const restored = await restorePdfFromCache(record.invoiceNumber);
    if (!restored) {
      onFormSubmit(normalized);
    }

    setModalState(false);
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-auto max-h-72">
      {savedInvoices.map((record) => {
        const status = toDisplayStatus(record.status);
        const cacheMeta = getCachedPdfMeta(record.invoiceNumber);
        const testId = toInvoiceTestId(record.invoiceNumber);

        return (
          <Card
            key={record.id}
            className="p-2 border rounded-sm hover:border-blue-500 hover:shadow-lg cursor-pointer"
            data-testid={`saved-invoice-card-${testId}`}
          >
            <CardContent className="flex justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Invoice #{record.invoiceNumber}</p>
                  <Badge variant={status.variant}>{_t(status.labelKey)}</Badge>
                  {cacheMeta && (
                    <Badge variant="secondary">
                      {_t("savedInvoices.cachedPdf")} ({formatCacheSize(cacheMeta.sizeBytes)})
                    </Badge>
                  )}
                </div>

                <small className="text-gray-500">
                  {_t("savedInvoices.updatedAt")}: {record.data.details.updatedAt || new Date(record.updatedAt).toLocaleString()}
                </small>
                {cacheMeta && (
                  <small className="text-gray-500 block">
                    {_t("savedInvoices.cachedUpdatedAt")}:{" "}
                    {new Date(cacheMeta.updatedAt).toLocaleString()}
                  </small>
                )}

                <div>
                  <p>{_t("savedInvoices.sender")}: {record.data.sender.name}</p>
                  <p>{_t("savedInvoices.receiver")}: {record.data.receiver.name}</p>
                  <p>
                    {_t("savedInvoices.total")}:{" "}
                    <span className="font-semibold">
                      {formatNumberWithCommas(Number(record.data.details.totalAmount))}{" "}
                      {record.data.details.currency}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <BaseButton
                  tooltipLabel="Load invoice details into the form"
                  variant="outline"
                  size="sm"
                  data-testid={`saved-invoice-load-${testId}`}
                  onClick={() => {
                    void loadInvoice(record);
                  }}
                >
                  {_t("savedInvoices.load")}
                </BaseButton>

                <BaseButton
                  tooltipLabel="Load invoice and generate or restore PDF"
                  variant="outline"
                  size="sm"
                  data-testid={`saved-invoice-load-generate-${testId}`}
                  onClick={() => {
                    void loadAndGeneratePdf(record);
                  }}
                >
                  {_t("savedInvoices.loadAndGenerate")}
                </BaseButton>

                <BaseButton
                  tooltipLabel="Duplicate invoice"
                  variant="outline"
                  size="sm"
                  data-testid={`saved-invoice-duplicate-${testId}`}
                  onClick={() => duplicateInvoice(record.id)}
                >
                  {_t("savedInvoices.duplicate")}
                </BaseButton>

                {record.status !== "paid" && (
                  <BaseButton
                    tooltipLabel="Mark invoice as paid"
                    variant="outline"
                    size="sm"
                    data-testid={`saved-invoice-mark-paid-${testId}`}
                    onClick={() => updateSavedInvoiceStatus(record.id, "paid")}
                  >
                    {_t("savedInvoices.markPaid")}
                  </BaseButton>
                )}

                <BaseButton
                  variant="destructive"
                  size="sm"
                  data-testid={`saved-invoice-delete-${testId}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteInvoice(record.id);
                  }}
                >
                  {_t("savedInvoices.delete")}
                </BaseButton>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {savedInvoices.length === 0 && (
        <div>
          <p>{_t("savedInvoices.empty")}</p>
        </div>
      )}
    </div>
  );
};

export default SavedInvoicesList;
