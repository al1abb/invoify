"use client";

import React, { useMemo, useState } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type StatusFilter = "all" | SavedInvoiceRecord["status"];

type SortOption =
  | "updated_desc"
  | "updated_asc"
  | "invoice_asc"
  | "invoice_desc"
  | "total_desc"
  | "total_asc";

const PAGE_SIZE = 6;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("updated_desc");
  const [page, setPage] = useState(1);

  const query = searchQuery.trim().toLowerCase();

  const filteredAndSortedInvoices = useMemo(() => {
    const filtered = savedInvoices.filter((record) => {
      if (statusFilter !== "all" && record.status !== statusFilter) {
        return false;
      }

      if (!query) return true;

      const invoiceNumber = record.invoiceNumber.toLowerCase();
      const senderName = record.data.sender.name.toLowerCase();
      const receiverName = record.data.receiver.name.toLowerCase();

      return (
        invoiceNumber.includes(query) ||
        senderName.includes(query) ||
        receiverName.includes(query)
      );
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      const totalA = Number(a.data.details.totalAmount) || 0;
      const totalB = Number(b.data.details.totalAmount) || 0;

      switch (sortOption) {
        case "updated_asc":
          return a.updatedAt - b.updatedAt;
        case "invoice_asc":
          return a.invoiceNumber.localeCompare(b.invoiceNumber, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        case "invoice_desc":
          return b.invoiceNumber.localeCompare(a.invoiceNumber, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        case "total_asc":
          return totalA - totalB;
        case "total_desc":
          return totalB - totalA;
        case "updated_desc":
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

    return sorted;
  }, [query, savedInvoices, sortOption, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedInvoices.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedInvoices = filteredAndSortedInvoices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
      <div className="flex flex-col gap-2">
        <Input
          placeholder={_t("savedInvoices.searchPlaceholder")}
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setPage(1);
          }}
          data-testid="saved-invoices-search"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as StatusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger data-testid="saved-invoices-status-filter">
              <SelectValue placeholder={_t("savedInvoices.filterStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t("savedInvoices.filterAll")}</SelectItem>
              <SelectItem value="draft">{_t("savedInvoices.status.draft")}</SelectItem>
              <SelectItem value="sent">{_t("savedInvoices.status.sent")}</SelectItem>
              <SelectItem value="paid">{_t("savedInvoices.status.paid")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOption}
            onValueChange={(value) => {
              setSortOption(value as SortOption);
              setPage(1);
            }}
          >
            <SelectTrigger data-testid="saved-invoices-sort">
              <SelectValue placeholder={_t("savedInvoices.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_desc">
                {_t("savedInvoices.sort.updatedDesc")}
              </SelectItem>
              <SelectItem value="updated_asc">
                {_t("savedInvoices.sort.updatedAsc")}
              </SelectItem>
              <SelectItem value="invoice_asc">
                {_t("savedInvoices.sort.invoiceAsc")}
              </SelectItem>
              <SelectItem value="invoice_desc">
                {_t("savedInvoices.sort.invoiceDesc")}
              </SelectItem>
              <SelectItem value="total_desc">
                {_t("savedInvoices.sort.totalDesc")}
              </SelectItem>
              <SelectItem value="total_asc">
                {_t("savedInvoices.sort.totalAsc")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <small className="text-gray-500">
          {_t("savedInvoices.showing")}: {paginatedInvoices.length} /{" "}
          {filteredAndSortedInvoices.length}
        </small>
      </div>

      {paginatedInvoices.map((record) => {
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

      {savedInvoices.length > 0 && filteredAndSortedInvoices.length === 0 && (
        <div>
          <p>{_t("savedInvoices.noResults")}</p>
        </div>
      )}

      {filteredAndSortedInvoices.length > PAGE_SIZE && (
        <div className="flex items-center justify-between gap-2">
          <BaseButton
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            data-testid="saved-invoices-prev-page"
          >
            {_t("savedInvoices.prevPage")}
          </BaseButton>
          <small className="text-gray-500">
            {_t("savedInvoices.page")} {currentPage} {_t("savedInvoices.of")}{" "}
            {totalPages}
          </small>
          <BaseButton
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            data-testid="saved-invoices-next-page"
          >
            {_t("savedInvoices.nextPage")}
          </BaseButton>
        </div>
      )}
    </div>
  );
};

export default SavedInvoicesList;
