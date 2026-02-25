import { describe, expect, it } from "vitest";

import {
  readSavedInvoices,
  SAVED_INVOICES_KEY_V2,
  SAVED_INVOICES_KEY_V3,
  writeSavedInvoices,
} from "@/lib/storage/savedInvoices";
import { SavedInvoiceRecord } from "@/types";

describe("saved invoice storage", () => {
  it("migrates v2 array payload into v3 envelope", () => {
    window.localStorage.setItem(
      SAVED_INVOICES_KEY_V2,
      JSON.stringify([
        {
          id: "record-1",
          invoiceNumber: "INV-001",
          status: "draft",
          createdAt: 100,
          updatedAt: 200,
          data: {
            details: {
              invoiceNumber: "INV-001",
              totalAmount: 120,
              dueDate: "2026-02-10",
            },
          },
        },
      ])
    );

    const records = readSavedInvoices();

    expect(records).toHaveLength(1);
    expect(records[0].invoiceNumber).toBe("INV-001");
    expect(window.localStorage.getItem(SAVED_INVOICES_KEY_V2)).toBeNull();

    const migratedRaw = window.localStorage.getItem(SAVED_INVOICES_KEY_V3);
    expect(migratedRaw).not.toBeNull();
    const migrated = JSON.parse(String(migratedRaw));
    expect(migrated.version).toBe(3);
    expect(Array.isArray(migrated.records)).toBe(true);
  });

  it("backs up corrupted v3 payload and returns safe empty list", () => {
    window.localStorage.setItem(SAVED_INVOICES_KEY_V3, "{bad-json");

    const records = readSavedInvoices();

    expect(records).toEqual([]);
    expect(window.localStorage.getItem(SAVED_INVOICES_KEY_V3)).toBeNull();

    const backupKey = Object.keys(window.localStorage).find((key) =>
      key.startsWith("invoify:backup:saved_invoices:")
    );
    expect(backupKey).toBeTruthy();
    expect(window.localStorage.getItem(String(backupKey))).toBe("{bad-json");
  });

  it("writes normalized records as v3 envelope", () => {
    const record: SavedInvoiceRecord = {
      id: "record-2",
      invoiceNumber: "INV-002",
      status: "sent",
      createdAt: 100,
      updatedAt: 200,
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
          invoiceNumber: "INV-002",
          invoiceDate: "",
          dueDate: "2026-02-01",
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
          subTotal: 50,
          totalAmount: 50,
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
        baseInvoiceNumber: "INV-002",
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
    };

    const wrote = writeSavedInvoices([record]);

    expect(wrote).toBe(true);

    const raw = window.localStorage.getItem(SAVED_INVOICES_KEY_V3);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(String(raw));
    expect(parsed.version).toBe(3);
    expect(parsed.records[0].invoiceNumber).toBe("INV-002");
  });
});
