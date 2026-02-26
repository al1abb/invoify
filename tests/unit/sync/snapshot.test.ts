import { describe, expect, it, vi } from "vitest";

import {
  buildCappedSyncSnapshot,
  buildSyncSignature,
  toSnapshotPayloadSize,
} from "@/lib/sync/snapshot";
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

describe("sync snapshot helpers", () => {
  it("caps snapshot records and keeps latest updates first", () => {
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1700000000000);

    const snapshot = buildCappedSyncSnapshot({
      reason: "state_change",
      savedInvoices: [
        createSavedInvoice({ id: "inv-a", updatedAt: 5 }),
        createSavedInvoice({ id: "inv-b", updatedAt: 9 }),
        createSavedInvoice({ id: "inv-c", updatedAt: 2 }),
      ],
      customerTemplates: [
        createTemplate({ id: "tpl-a", updatedAt: 4 }),
        createTemplate({ id: "tpl-b", updatedAt: 7 }),
        createTemplate({ id: "tpl-c", updatedAt: 1 }),
      ],
      maxInvoices: 2,
      maxTemplates: 2,
    });

    expect(snapshot.timestamp).toBe(1700000000000);
    expect(snapshot.savedInvoices.map((record) => record.id)).toEqual([
      "inv-b",
      "inv-a",
    ]);
    expect(snapshot.customerTemplates.map((record) => record.id)).toEqual([
      "tpl-b",
      "tpl-a",
    ]);

    nowSpy.mockRestore();
  });

  it("changes signature when tracked invoice/template fields change", () => {
    const baseSnapshot = buildCappedSyncSnapshot({
      reason: "state_change",
      savedInvoices: [
        createSavedInvoice({ id: "inv-1", invoiceNumber: "INV-1", updatedAt: 1 }),
      ],
      customerTemplates: [
        createTemplate({ id: "tpl-1", name: "Template 1", updatedAt: 1 }),
      ],
      maxInvoices: 5,
      maxTemplates: 5,
    });

    const updatedSnapshot = buildCappedSyncSnapshot({
      reason: "state_change",
      savedInvoices: [
        createSavedInvoice({
          id: "inv-1",
          invoiceNumber: "INV-1",
          status: "paid",
          updatedAt: 2,
        }),
      ],
      customerTemplates: [
        createTemplate({ id: "tpl-1", name: "Template 1 (new)", updatedAt: 2 }),
      ],
      maxInvoices: 5,
      maxTemplates: 5,
    });

    expect(buildSyncSignature(baseSnapshot)).not.toBe(
      buildSyncSignature(updatedSnapshot)
    );
  });

  it("estimates payload bytes and increases with larger snapshots", () => {
    const small = buildCappedSyncSnapshot({
      reason: "state_change",
      savedInvoices: [createSavedInvoice({ id: "inv-small", updatedAt: 1 })],
      customerTemplates: [createTemplate({ id: "tpl-small", updatedAt: 1 })],
      maxInvoices: 5,
      maxTemplates: 5,
    });

    const large = buildCappedSyncSnapshot({
      reason: "state_change",
      savedInvoices: [
        createSavedInvoice({ id: "inv-large-1", updatedAt: 1 }),
        createSavedInvoice({ id: "inv-large-2", updatedAt: 2 }),
        createSavedInvoice({ id: "inv-large-3", updatedAt: 3 }),
      ],
      customerTemplates: [
        createTemplate({ id: "tpl-large-1", updatedAt: 1 }),
        createTemplate({ id: "tpl-large-2", updatedAt: 2 }),
      ],
      maxInvoices: 5,
      maxTemplates: 5,
    });

    const smallSize = toSnapshotPayloadSize(small);
    const largeSize = toSnapshotPayloadSize(large);

    expect(smallSize).toBeGreaterThan(0);
    expect(largeSize).toBeGreaterThan(smallSize);
  });
});
