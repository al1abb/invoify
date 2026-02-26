import { describe, expect, it } from "vitest";

import {
  createInitialSyncStatus,
  replaceSavedInvoiceByKey,
  replaceTemplateById,
} from "@/contexts/invoice/stateHelpers";
import { CustomerTemplateRecord, SavedInvoiceRecord } from "@/types";

const createSavedInvoice = (
  overrides: Partial<SavedInvoiceRecord> = {}
): SavedInvoiceRecord => {
  const id = overrides.id || "invoice-1";
  const invoiceNumber = overrides.invoiceNumber || "INV-1";

  return {
    id,
    invoiceNumber,
    status: "draft",
    createdAt: 1,
    updatedAt: 1,
    data: {
      sender: {
        name: "Sender",
        address: "Address",
        zipCode: "12345",
        city: "City",
        country: "Country",
        email: "sender@example.com",
        phone: "123",
        customInputs: [],
      },
      receiver: {
        name: "Receiver",
        address: "Address",
        zipCode: "12345",
        city: "City",
        country: "Country",
        email: "receiver@example.com",
        phone: "456",
        customInputs: [],
      },
      details: {
        invoiceLogo: "",
        invoiceNumber,
        invoiceDate: "2026-02-01",
        dueDate: "2026-03-01",
        purchaseOrderNumber: "",
        currency: "USD",
        language: "en",
        items: [],
        paymentInformation: {
          bankName: "Bank",
          accountName: "Account",
          accountNumber: "123",
        },
        taxDetails: {
          amount: 0,
          taxID: "",
          amountType: "amount",
        },
        discountDetails: {
          amount: 0,
          amountType: "amount",
        },
        shippingDetails: {
          cost: 0,
          costType: "amount",
        },
        subTotal: 0,
        totalAmount: 0,
        totalAmountInWords: "zero",
        additionalNotes: "",
        paymentTerms: "Due on receipt",
        updatedAt: "",
        pdfTemplate: 1,
      },
    },
    recurring: {
      enabled: false,
      frequency: null,
      baseInvoiceNumber: invoiceNumber,
      counter: 0,
      lastIssuedAt: null,
      nextIssueAt: null,
    },
    payment: {
      amountPaid: 0,
      lastPaymentAt: null,
    },
    reminder: {
      enabled: true,
      lastSentAt: null,
      sendCount: 0,
      nextReminderAt: null,
    },
    timeline: [],
    ...overrides,
  };
};

const createTemplate = (
  overrides: Partial<CustomerTemplateRecord> = {}
): CustomerTemplateRecord => {
  return {
    id: overrides.id || "template-1",
    name: overrides.name || "Template 1",
    sender: {
      name: "Sender",
      address: "Address",
      zipCode: "12345",
      city: "City",
      country: "Country",
      email: "sender@example.com",
      phone: "123",
      customInputs: [],
    },
    receiver: {
      name: "Receiver",
      address: "Address",
      zipCode: "54321",
      city: "City",
      country: "Country",
      email: "receiver@example.com",
      phone: "456",
      customInputs: [],
    },
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
};

describe("invoice state helpers", () => {
  it("replaces invoice by invoiceNumber key and keeps records sorted by updatedAt", () => {
    const records = [
      createSavedInvoice({ id: "old-a", invoiceNumber: "INV-100", updatedAt: 2 }),
      createSavedInvoice({ id: "old-b", invoiceNumber: "INV-200", updatedAt: 5 }),
    ];
    const nextRecord = createSavedInvoice({
      id: "new-a",
      invoiceNumber: "INV-100",
      updatedAt: 9,
      status: "paid",
    });

    const result = replaceSavedInvoiceByKey(records, "INV-100", nextRecord);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("new-a");
    expect(result[0].status).toBe("paid");
    expect(result.map((record) => record.id)).not.toContain("old-a");
  });

  it("falls back to id when invoiceNumber key is blank", () => {
    const records = [
      createSavedInvoice({ id: "blank-id", invoiceNumber: "", updatedAt: 1 }),
      createSavedInvoice({ id: "other-id", invoiceNumber: "INV-2", updatedAt: 3 }),
    ];
    const nextRecord = createSavedInvoice({
      id: "blank-id",
      invoiceNumber: "",
      updatedAt: 10,
      status: "sent",
    });

    const result = replaceSavedInvoiceByKey(records, "blank-id", nextRecord);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("blank-id");
    expect(result[0].status).toBe("sent");
    expect(result.filter((record) => record.id === "blank-id")).toHaveLength(1);
  });

  it("replaces template by id and sorts by updatedAt descending", () => {
    const records = [
      createTemplate({ id: "template-1", name: "A", updatedAt: 4 }),
      createTemplate({ id: "template-2", name: "B", updatedAt: 7 }),
    ];
    const nextRecord = createTemplate({
      id: "template-1",
      name: "A renamed",
      updatedAt: 9,
    });

    const result = replaceTemplateById(records, "template-1", nextRecord);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("template-1");
    expect(result[0].name).toBe("A renamed");
  });

  it("builds initial sync status with null timestamps and reason", () => {
    const status = createInitialSyncStatus("supabase-rest");

    expect(status).toEqual({
      state: "idle",
      provider: "supabase-rest",
      lastAttemptAt: null,
      lastSuccessAt: null,
      reason: null,
      errorMessage: null,
    });
  });
});
