import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { generatePdfServiceMock } = vi.hoisted(() => ({
  generatePdfServiceMock: vi.fn(),
}));

vi.mock("@/services/invoice/server/generatePdfService", () => ({
  generatePdfService: generatePdfServiceMock,
}));

import { POST } from "@/app/api/invoice/generate/route";

describe("/api/invoice/generate", () => {
  beforeEach(() => {
    generatePdfServiceMock.mockReset();
  });

  it("returns structured invalid_json error", async () => {
    const req = new NextRequest("http://localhost/api/invoice/generate", {
      method: "POST",
      body: "not-json",
      headers: {
        "content-type": "application/json",
      },
    });

    const res = await POST(req);
    const payload = await res.json();

    expect(res.status).toBe(400);
    expect(payload).toMatchObject({
      error: {
        code: "invalid_json",
        message: expect.any(String),
      },
    });
    expect(generatePdfServiceMock).not.toHaveBeenCalled();
  });

  it("returns structured validation_error for invalid payload", async () => {
    const req = new NextRequest("http://localhost/api/invoice/generate", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "content-type": "application/json",
      },
    });

    const res = await POST(req);
    const payload = await res.json();

    expect(res.status).toBe(400);
    expect(payload.error.code).toBe("validation_error");
    expect(payload.error.details).toBeTruthy();
    expect(generatePdfServiceMock).not.toHaveBeenCalled();
  });

  it("passes validated payload to service", async () => {
    generatePdfServiceMock.mockResolvedValueOnce(
      NextResponse.json({ ok: true }, { status: 200 })
    );

    const validPayload = {
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
        invoiceDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
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
    };

    const req = new NextRequest("http://localhost/api/invoice/generate", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: {
        "content-type": "application/json",
      },
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(generatePdfServiceMock).toHaveBeenCalledTimes(1);
  });
});
