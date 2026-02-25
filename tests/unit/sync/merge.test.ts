import { describe, expect, it } from "vitest";

import { mergeRemoteSnapshotWithLocal } from "@/lib/sync/merge";
import { CustomerTemplateRecord, SavedInvoiceRecord } from "@/types";

const baseInvoice = (overrides: Partial<SavedInvoiceRecord>): SavedInvoiceRecord => {
  return {
    id: "invoice-1",
    invoiceNumber: "INV-1",
    status: "draft",
    createdAt: 1,
    updatedAt: 1,
    data: {
      sender: {
        name: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        customInputs: [],
      },
      receiver: {
        name: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        customInputs: [],
      },
      details: {
        invoiceLogo: "",
        invoiceNumber: "INV-1",
        invoiceDate: "",
        dueDate: "",
        purchaseOrderNumber: "",
        currency: "USD",
        language: "en",
        items: [],
        paymentInformation: {
          bankName: "",
          accountName: "",
          accountNumber: "",
        },
        taxDetails: {
          amount: 0,
          amountType: "amount",
          taxID: "",
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
        totalAmountInWords: "",
        additionalNotes: "",
        paymentTerms: "",
        updatedAt: "",
        pdfTemplate: 1,
      },
    },
    recurring: {
      enabled: false,
      frequency: null,
      baseInvoiceNumber: "INV-1",
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

const baseTemplate = (overrides: Partial<CustomerTemplateRecord>): CustomerTemplateRecord => {
  return {
    id: "template-1",
    name: "Template",
    sender: {
      name: "",
      address: "",
      zipCode: "",
      city: "",
      country: "",
      email: "",
      phone: "",
      customInputs: [],
    },
    receiver: {
      name: "",
      address: "",
      zipCode: "",
      city: "",
      country: "",
      email: "",
      phone: "",
      customInputs: [],
    },
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
};

describe("sync merge", () => {
  it("creates conflict and defaults to most recently updated invoice", () => {
    const local = baseInvoice({ status: "sent", updatedAt: 20 });
    const remote = baseInvoice({ status: "paid", updatedAt: 10 });

    const result = mergeRemoteSnapshotWithLocal({
      localSavedInvoices: [local],
      remoteSavedInvoices: [remote],
      localCustomerTemplates: [],
      remoteCustomerTemplates: [],
    });

    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].entityType).toBe("invoice");
    expect(result.conflicts[0].defaultChoice).toBe("local");
    expect(result.savedInvoices[0].status).toBe("sent");
  });

  it("merges templates and keeps newest by updatedAt", () => {
    const localTemplate = baseTemplate({ updatedAt: 5, name: "Local Template" });
    const remoteTemplate = baseTemplate({ updatedAt: 8, name: "Cloud Template" });

    const result = mergeRemoteSnapshotWithLocal({
      localSavedInvoices: [],
      remoteSavedInvoices: [],
      localCustomerTemplates: [localTemplate],
      remoteCustomerTemplates: [remoteTemplate],
    });

    expect(result.customerTemplates).toHaveLength(1);
    expect(result.customerTemplates[0].name).toBe("Cloud Template");
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].defaultChoice).toBe("cloud");
  });
});
