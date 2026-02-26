import { describe, expect, it } from "vitest";

import { InvoiceSchema } from "@/lib/schemas";

const createValidInvoicePayload = () => ({
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
  details: {
    invoiceLogo: "",
    invoiceNumber: "INV-001",
    invoiceDate: new Date(),
    dueDate: new Date(),
    purchaseOrderNumber: "",
    currency: "USD",
    language: "en",
    items: [
      {
        name: "Item",
        description: "Desc",
        quantity: 1,
        unitPrice: 10,
        total: 10,
      },
    ],
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
    subTotal: 10,
    totalAmount: 10,
    totalAmountInWords: "ten",
    additionalNotes: "",
    paymentTerms: "Due now",
    signature: {
      data: "",
    },
    updatedAt: "",
    pdfTemplate: 1,
  },
});

describe("InvoiceSchema", () => {
  it("allows zero values for non-negative totals", () => {
    const payload = createValidInvoicePayload();
    payload.details.subTotal = 0;
    payload.details.totalAmount = 0;

    const parsed = InvoiceSchema.safeParse(payload);

    expect(parsed.success).toBe(true);
  });

  it("uses non-negative wording for total validation errors", () => {
    const payload = createValidInvoicePayload();
    payload.details.subTotal = -1;

    const parsed = InvoiceSchema.safeParse(payload);

    expect(parsed.success).toBe(false);
    if (parsed.success) {
      return;
    }

    expect(parsed.error.issues[0]?.message).toBe("Must be a non-negative number");
  });

  it("keeps zip code length validation wording", () => {
    const payload = createValidInvoicePayload();
    payload.sender.zipCode = "1";

    const parsed = InvoiceSchema.safeParse(payload);

    expect(parsed.success).toBe(false);
    if (parsed.success) {
      return;
    }

    const zipIssue = parsed.error.issues.find(
      (issue) => issue.path.join(".") === "sender.zipCode"
    );

    expect(zipIssue?.message).toBe("Must be between 2 and 20 characters");
  });

  it("keeps 1-character minimum wording for required text fields", () => {
    const payload = createValidInvoicePayload();
    payload.details.invoiceNumber = "";

    const parsed = InvoiceSchema.safeParse(payload);

    expect(parsed.success).toBe(false);
    if (parsed.success) {
      return;
    }

    const invoiceNumberIssue = parsed.error.issues.find(
      (issue) => issue.path.join(".") === "details.invoiceNumber"
    );

    expect(invoiceNumberIssue?.message).toBe("Must be at least 1 character");
  });

  it("applies country defaults when fields are omitted", () => {
    const payload = createValidInvoicePayload();
    delete (payload.sender as Record<string, unknown>).country;
    delete (payload.receiver as Record<string, unknown>).country;

    const parsed = InvoiceSchema.safeParse(payload);

    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      return;
    }

    expect(parsed.data.sender.country).toBe("");
    expect(parsed.data.receiver.country).toBe("");
  });
});
