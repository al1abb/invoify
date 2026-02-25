import { FORM_DEFAULT_VALUES } from "@/lib/variables";
import { InvoiceType } from "@/types";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toStringValue = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const toNumberValue = (value: unknown, fallback = 0) => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : fallback;
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toDateLikeValue = (value: unknown, fallback = ""): string => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  const parsed = Date.parse(String(value ?? ""));
  if (!Number.isFinite(parsed)) return fallback;

  return new Date(parsed).toISOString();
};

const toChargeType = (value: unknown): "amount" | "percentage" => {
  return value === "percentage" ? "percentage" : "amount";
};

const cloneDefaults = (): InvoiceType => {
  return JSON.parse(JSON.stringify(FORM_DEFAULT_VALUES)) as InvoiceType;
};

const normalizeCustomInputs = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry) => isRecord(entry))
    .map((entry) => ({
      key: toStringValue(entry.key),
      value: toStringValue(entry.value),
    }));
};

const normalizeParty = (
  value: unknown,
  fallback: InvoiceType["sender"] | InvoiceType["receiver"]
) => {
  const source = isRecord(value) ? value : {};

  return {
    ...fallback,
    name: toStringValue(source.name, fallback.name),
    address: toStringValue(source.address, fallback.address),
    zipCode: toStringValue(source.zipCode, fallback.zipCode),
    city: toStringValue(source.city, fallback.city),
    country: toStringValue(source.country, fallback.country),
    email: toStringValue(source.email, fallback.email),
    phone: toStringValue(source.phone, fallback.phone),
    customInputs: normalizeCustomInputs(source.customInputs),
  };
};

const normalizeItems = (
  value: unknown,
  fallbackItems: InvoiceType["details"]["items"]
) => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallbackItems;
  }

  return value
    .filter((item) => isRecord(item))
    .map((item) => {
      const quantity = toNumberValue(item.quantity, 0);
      const unitPrice = toNumberValue(item.unitPrice, 0);
      const total = toNumberValue(item.total, quantity * unitPrice);

      return {
        name: toStringValue(item.name),
        description: toStringValue(item.description),
        quantity,
        unitPrice,
        total,
      };
    });
};

const normalizeSignature = (value: unknown) => {
  if (!isRecord(value)) {
    return {
      data: "",
    };
  }

  const data = toStringValue(value.data);
  if (!data) {
    return {
      data: "",
    };
  }

  const fontFamily = toStringValue(value.fontFamily);

  return {
    data,
    ...(fontFamily ? { fontFamily } : {}),
  };
};

const normalizeInvoiceDetails = (
  value: unknown,
  fallback: InvoiceType["details"]
): InvoiceType["details"] => {
  const source = isRecord(value) ? value : {};
  const fallbackPaymentInformation = fallback.paymentInformation || {
    bankName: "",
    accountName: "",
    accountNumber: "",
  };
  const fallbackTaxDetails = fallback.taxDetails || {
    amount: 0,
    taxID: "",
    amountType: "amount",
  };
  const fallbackDiscountDetails = fallback.discountDetails || {
    amount: 0,
    amountType: "amount",
  };
  const fallbackShippingDetails = fallback.shippingDetails || {
    cost: 0,
    costType: "amount",
  };

  const paymentInformationSource = isRecord(source.paymentInformation)
    ? source.paymentInformation
    : {};
  const taxDetailsSource = isRecord(source.taxDetails) ? source.taxDetails : {};
  const discountDetailsSource = isRecord(source.discountDetails)
    ? source.discountDetails
    : {};
  const shippingDetailsSource = isRecord(source.shippingDetails)
    ? source.shippingDetails
    : {};

  const pdfTemplateRaw = toNumberValue(source.pdfTemplate, fallback.pdfTemplate);
  const pdfTemplate = Number.isInteger(pdfTemplateRaw) && pdfTemplateRaw > 0
    ? pdfTemplateRaw
    : fallback.pdfTemplate;

  return {
    ...fallback,
    invoiceLogo: toStringValue(source.invoiceLogo, fallback.invoiceLogo || ""),
    invoiceNumber: toStringValue(source.invoiceNumber, fallback.invoiceNumber),
    invoiceDate: toDateLikeValue(source.invoiceDate, fallback.invoiceDate),
    dueDate: toDateLikeValue(source.dueDate, fallback.dueDate),
    purchaseOrderNumber: toStringValue(
      source.purchaseOrderNumber,
      fallback.purchaseOrderNumber || ""
    ),
    currency: toStringValue(source.currency, fallback.currency),
    language: toStringValue(source.language, fallback.language),
    items: normalizeItems(source.items, fallback.items),
    paymentInformation: {
      bankName: toStringValue(
        paymentInformationSource.bankName,
        fallbackPaymentInformation.bankName
      ),
      accountName: toStringValue(
        paymentInformationSource.accountName,
        fallbackPaymentInformation.accountName
      ),
      accountNumber: toStringValue(
        paymentInformationSource.accountNumber,
        fallbackPaymentInformation.accountNumber
      ),
    },
    taxDetails: {
      amount: toNumberValue(taxDetailsSource.amount, fallbackTaxDetails.amount),
      taxID: toStringValue(taxDetailsSource.taxID, fallbackTaxDetails.taxID),
      amountType: toChargeType(taxDetailsSource.amountType),
    },
    discountDetails: {
      amount: toNumberValue(
        discountDetailsSource.amount,
        fallbackDiscountDetails.amount
      ),
      amountType: toChargeType(discountDetailsSource.amountType),
    },
    shippingDetails: {
      cost: toNumberValue(
        shippingDetailsSource.cost,
        fallbackShippingDetails.cost
      ),
      costType: toChargeType(shippingDetailsSource.costType),
    },
    subTotal: Math.max(0, toNumberValue(source.subTotal, fallback.subTotal)),
    totalAmount: Math.max(
      0,
      toNumberValue(source.totalAmount, fallback.totalAmount)
    ),
    totalAmountInWords: toStringValue(
      source.totalAmountInWords,
      fallback.totalAmountInWords
    ),
    additionalNotes: toStringValue(
      source.additionalNotes,
      fallback.additionalNotes || ""
    ),
    paymentTerms: toStringValue(source.paymentTerms, fallback.paymentTerms || ""),
    signature: normalizeSignature(source.signature),
    updatedAt: toStringValue(source.updatedAt, fallback.updatedAt || ""),
    pdfTemplate,
  };
};

export const normalizeInvoiceDraft = (value: unknown): InvoiceType | null => {
  if (!isRecord(value)) return null;

  const defaults = cloneDefaults();

  return {
    sender: normalizeParty(value.sender, defaults.sender),
    receiver: normalizeParty(value.receiver, defaults.receiver),
    details: normalizeInvoiceDetails(value.details, defaults.details),
  };
};

export const normalizeInvoiceParty = (value: unknown): InvoiceType["sender"] => {
  const defaults = cloneDefaults();
  return normalizeParty(value, defaults.sender);
};
