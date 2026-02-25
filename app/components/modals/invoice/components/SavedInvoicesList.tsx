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
import {
  InvoiceTimelineEventType,
  InvoiceType,
  RecurringFrequency,
  SavedInvoiceRecord,
} from "@/types";

type SavedInvoicesListProps = {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
};

type StatusFilter = "all" | SavedInvoiceRecord["status"];

type SortOption =
  | "updated_desc"
  | "updated_asc"
  | "invoice_asc"
  | "invoice_desc"
  | "total_desc"
  | "total_asc";

type InvoiceFormCompatible = Omit<InvoiceType, "details"> & {
  details: Omit<InvoiceType["details"], "dueDate" | "invoiceDate"> & {
    dueDate: Date | string;
    invoiceDate: Date | string;
  };
};

const PAGE_SIZE = 6;

const toDisplayStatus = (status: SavedInvoiceRecord["status"]) => {
  switch (status) {
    case "paid":
      return {
        labelKey: "savedInvoices.status.paid",
        variant: "default" as const,
      };
    case "sent":
      return {
        labelKey: "savedInvoices.status.sent",
        variant: "secondary" as const,
      };
    default:
      return {
        labelKey: "savedInvoices.status.draft",
        variant: "outline" as const,
      };
  }
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

const toInvoiceTestId = (invoiceNumber: string) => {
  return invoiceNumber.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};

const formatCacheSize = (sizeBytes: number) => {
  if (sizeBytes < 1024) return `${sizeBytes} B`;

  const kb = sizeBytes / 1024;
  if (kb < 1024) return `${Math.ceil(kb)} KB`;

  return `${(kb / 1024).toFixed(1)} MB`;
};

const toRecurringSelectValue = (frequency: RecurringFrequency | null | undefined) => {
  return frequency ?? "none";
};

const fromRecurringSelectValue = (value: string): RecurringFrequency | null => {
  if (value === "weekly" || value === "monthly") {
    return value;
  }

  return null;
};

const toTimelineLabelKey = (type: InvoiceTimelineEventType) => {
  switch (type) {
    case "status_changed":
      return "savedInvoices.timeline.statusChanged";
    case "payment_recorded":
      return "savedInvoices.timeline.paymentRecorded";
    case "reminder_sent":
      return "savedInvoices.timeline.reminderSent";
    case "duplicated":
      return "savedInvoices.timeline.duplicated";
    case "recurring_enabled":
      return "savedInvoices.timeline.recurringEnabled";
    case "recurring_disabled":
      return "savedInvoices.timeline.recurringDisabled";
    case "recurring_generated":
      return "savedInvoices.timeline.recurringGenerated";
    case "created":
    default:
      return "savedInvoices.timeline.created";
  }
};

const toTimestamp = (value: unknown) => {
  const parsed = Date.parse(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const toAmountNumber = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
};

const SavedInvoicesList = ({ setModalState }: SavedInvoicesListProps) => {
  const {
    savedInvoices,
    onFormSubmit,
    deleteInvoice,
    duplicateInvoice,
    updateSavedInvoiceStatus,
    recordInvoicePayment,
    markInvoiceReminderSent,
    setInvoiceRecurring,
    generateRecurringInvoice,
    restorePdfFromCache,
    getCachedPdfMeta,
  } = useInvoiceContext();

  const { reset } = useFormContext<InvoiceType>();
  const { _t } = useTranslationContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("updated_desc");
  const [page, setPage] = useState(1);
  const [paymentAmountById, setPaymentAmountById] = useState<Record<string, string>>(
    {}
  );

  const query = searchQuery.trim().toLowerCase();
  const insights = useMemo(() => {
    const now = Date.now();

    return savedInvoices.reduce(
      (acc, record) => {
        const total = toAmountNumber(record.data.details.totalAmount);
        const paid = toAmountNumber(record.payment.amountPaid);
        const balance = Math.max(0, total - paid);

        if (balance > 0) {
          acc.totalOutstanding += balance;
        }

        const dueAt = toTimestamp(record.data.details.dueDate);
        if (record.status !== "paid" && balance > 0 && dueAt && dueAt < now) {
          acc.overdueCount += 1;
        }

        if (record.status === "sent" && balance > 0) {
          acc.sentButUnpaidCount += 1;
        }

        return acc;
      },
      {
        totalOutstanding: 0,
        overdueCount: 0,
        sentButUnpaidCount: 0,
      }
    );
  }, [savedInvoices]);

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

  const updatePaymentAmount = (id: string, value: string) => {
    setPaymentAmountById((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const clearPaymentAmount = (id: string) => {
    setPaymentAmountById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const onRecordPayment = (id: string) => {
    const raw = (paymentAmountById[id] || "").trim().replace(/,/g, "");
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0) return;

    const updated = recordInvoicePayment(id, amount);
    if (updated) {
      clearPaymentAmount(id);
    }
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-auto max-h-72">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Card>
            <CardContent className="py-3">
              <p className="text-xs text-muted-foreground">
                {_t("savedInvoices.insights.totalOutstanding")}
              </p>
              <p className="text-base font-semibold">
                {formatNumberWithCommas(
                  Number(insights.totalOutstanding.toFixed(2))
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-3">
              <p className="text-xs text-muted-foreground">
                {_t("savedInvoices.insights.overdueCount")}
              </p>
              <p className="text-base font-semibold">{insights.overdueCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-3">
              <p className="text-xs text-muted-foreground">
                {_t("savedInvoices.insights.sentUnpaidCount")}
              </p>
              <p className="text-base font-semibold">
                {insights.sentButUnpaidCount}
              </p>
            </CardContent>
          </Card>
        </div>

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

        const currency = record.data.details.currency;
        const totalAmount = toAmountNumber(record.data.details.totalAmount);
        const amountPaid = toAmountNumber(record.payment?.amountPaid ?? 0);
        const balance = Math.max(0, totalAmount - amountPaid);

        const dueAt = toTimestamp(record.data.details.dueDate);
        const isOverdue =
          record.status !== "paid" && typeof dueAt === "number" && dueAt < Date.now();

        const recurringFrequency = record.recurring?.frequency ?? null;
        const recurringEnabled = Boolean(record.recurring?.enabled && recurringFrequency);
        const nextIssueAt = record.recurring?.nextIssueAt ?? null;

        const reminderLastSentAt = record.reminder?.lastSentAt ?? null;
        const reminderNextAt = record.reminder?.nextReminderAt ?? null;

        const paymentInput = paymentAmountById[record.id] || "";
        const parsedPayment = Number(paymentInput.trim().replace(/,/g, ""));
        const canRecordPayment = Number.isFinite(parsedPayment) && parsedPayment > 0;

        const timeline = Array.isArray(record.timeline) ? record.timeline.slice(0, 3) : [];

        return (
          <Card
            key={record.id}
            className="p-2 border rounded-sm hover:border-blue-500 hover:shadow-lg"
            data-testid={`saved-invoice-card-${testId}`}
          >
            <CardContent className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">Invoice #{record.invoiceNumber}</p>
                  <Badge variant={status.variant}>{_t(status.labelKey)}</Badge>
                  {isOverdue && (
                    <Badge variant="destructive">{_t("savedInvoices.overdue")}</Badge>
                  )}
                  {recurringEnabled && (
                    <Badge variant="secondary">
                      {_t("savedInvoices.recurring.badge")}: {recurringFrequency}
                    </Badge>
                  )}
                  {cacheMeta && (
                    <Badge variant="secondary">
                      {_t("savedInvoices.cachedPdf")} ({formatCacheSize(cacheMeta.sizeBytes)})
                    </Badge>
                  )}
                </div>

                <small className="text-gray-500 block">
                  {_t("savedInvoices.updatedAt")}: {" "}
                  {record.data.details.updatedAt ||
                    new Date(record.updatedAt).toLocaleString()}
                </small>

                {cacheMeta && (
                  <small className="text-gray-500 block">
                    {_t("savedInvoices.cachedUpdatedAt")}: {" "}
                    {new Date(cacheMeta.updatedAt).toLocaleString()}
                  </small>
                )}

                <div className="space-y-1">
                  <p>
                    {_t("savedInvoices.sender")}: {record.data.sender.name}
                  </p>
                  <p>
                    {_t("savedInvoices.receiver")}: {record.data.receiver.name}
                  </p>
                  <p>
                    {_t("savedInvoices.total")}: {" "}
                    <span className="font-semibold">
                      {formatNumberWithCommas(totalAmount)} {currency}
                    </span>
                  </p>
                  <p>
                    {_t("savedInvoices.payment.paid")}: {" "}
                    <span className="font-semibold">
                      {formatNumberWithCommas(amountPaid)} {currency}
                    </span>
                  </p>
                  <p>
                    {_t("savedInvoices.payment.balance")}: {" "}
                    <span className="font-semibold">
                      {formatNumberWithCommas(balance)} {currency}
                    </span>
                  </p>

                  {recurringEnabled && nextIssueAt && (
                    <p className="text-sm text-gray-600">
                      {_t("savedInvoices.recurring.nextIssue")}: {" "}
                      {new Date(nextIssueAt).toLocaleString()}
                    </p>
                  )}

                  {reminderLastSentAt && (
                    <p className="text-sm text-gray-600">
                      {_t("savedInvoices.reminder.lastSent")}: {" "}
                      {new Date(reminderLastSentAt).toLocaleString()}
                    </p>
                  )}

                  {reminderNextAt && (
                    <p className="text-sm text-gray-600">
                      {_t("savedInvoices.reminder.next")}: {" "}
                      {new Date(reminderNextAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="pt-1">
                  <p className="text-xs font-semibold text-gray-700">
                    {_t("savedInvoices.timeline.heading")}
                  </p>

                  {timeline.length === 0 && (
                    <p className="text-xs text-gray-500">
                      {_t("savedInvoices.timeline.empty")}
                    </p>
                  )}

                  {timeline.length > 0 && (
                    <ul className="space-y-1 mt-1">
                      {timeline.map((event) => (
                        <li key={event.id} className="text-xs text-gray-500">
                          <span className="font-medium text-gray-700">
                            {_t(toTimelineLabelKey(event.type))}
                          </span>{" "}
                          <span>{new Date(event.at).toLocaleString()}</span>
                          {typeof event.amount === "number" && (
                            <span>
                              {" "}- {_t("savedInvoices.timeline.amount")}: {" "}
                              {formatNumberWithCommas(event.amount)} {currency}
                            </span>
                          )}
                          {event.note && event.type !== "status_changed" && (
                            <span> - {event.note}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex w-full md:w-64 flex-col gap-2">
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

                {record.status === "paid" && (
                  <BaseButton
                    tooltipLabel="Mark invoice as unpaid"
                    variant="outline"
                    size="sm"
                    data-testid={`saved-invoice-mark-unpaid-${testId}`}
                    onClick={() => updateSavedInvoiceStatus(record.id, "draft")}
                  >
                    {_t("savedInvoices.markUnpaid")}
                  </BaseButton>
                )}

                {balance > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      value={paymentInput}
                      onChange={(event) => {
                        updatePaymentAmount(record.id, event.target.value);
                      }}
                      placeholder={_t("savedInvoices.payment.amountPlaceholder")}
                      inputMode="decimal"
                      data-testid={`saved-invoice-payment-input-${testId}`}
                    />
                    <BaseButton
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={!canRecordPayment}
                      data-testid={`saved-invoice-record-payment-${testId}`}
                      onClick={() => onRecordPayment(record.id)}
                    >
                      {_t("savedInvoices.payment.record")}
                    </BaseButton>
                  </div>
                )}

                <Select
                  value={toRecurringSelectValue(recurringFrequency)}
                  onValueChange={(value) => {
                    setInvoiceRecurring(record.id, fromRecurringSelectValue(value));
                  }}
                >
                  <SelectTrigger data-testid={`saved-invoice-recurring-${testId}`}>
                    <SelectValue placeholder={_t("savedInvoices.recurring.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {_t("savedInvoices.recurring.none")}
                    </SelectItem>
                    <SelectItem value="weekly">
                      {_t("savedInvoices.recurring.weekly")}
                    </SelectItem>
                    <SelectItem value="monthly">
                      {_t("savedInvoices.recurring.monthly")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {recurringEnabled && (
                  <BaseButton
                    variant="outline"
                    size="sm"
                    data-testid={`saved-invoice-generate-next-${testId}`}
                    onClick={() => generateRecurringInvoice(record.id)}
                  >
                    {_t("savedInvoices.recurring.generateNext")}
                  </BaseButton>
                )}

                {isOverdue && (
                  <BaseButton
                    variant="outline"
                    size="sm"
                    data-testid={`saved-invoice-send-reminder-${testId}`}
                    onClick={() => markInvoiceReminderSent(record.id)}
                  >
                    {_t("savedInvoices.reminder.send")}
                  </BaseButton>
                )}

                <BaseButton
                  variant="destructive"
                  size="sm"
                  data-testid={`saved-invoice-delete-${testId}`}
                  onClick={(event) => {
                    event.stopPropagation();
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
