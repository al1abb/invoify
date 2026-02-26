import { describe, expect, it } from "vitest";

import {
  toPdfFilename,
  toPdfFilenameMeta,
  toSafeFilenamePart,
} from "@/lib/invoice/pdfFilename";

describe("pdf filename helpers", () => {
  it("removes diacritics", () => {
    expect(toSafeFilenamePart("José", true)).toBe("Jose");
  });

  it("removes special characters", () => {
    expect(toSafeFilenamePart("Acme/West", true)).toBe("AcmeWest");
  });

  it("falls back when sanitized parts are empty", () => {
    expect(
      toPdfFilename({
        recipientName: "***",
        invoiceNumber: "###",
        documentType: "invoice",
      })
    ).toBe("Client_Invoice.pdf");
  });

  it("uses client_name_invoice format", () => {
    expect(
      toPdfFilename({
        recipientName: "Client Name",
        invoiceNumber: "INV-101",
        documentType: "invoice",
      })
    ).toBe("Client_Name_Invoice_INV-101.pdf");
  });

  it("uses quote label for quote documents", () => {
    expect(
      toPdfFilename({
        recipientName: "Client Name",
        invoiceNumber: "QTE-42",
        documentType: "quote",
      })
    ).toBe("Client_Name_Quote_QTE-42.pdf");
  });

  it("handles whitespace policy by flag", () => {
    expect(toSafeFilenamePart("Acme North", true)).toBe("AcmeNorth");
    expect(toSafeFilenamePart("Acme North", false)).toBe("Acme_North");
  });

  it("builds metadata from invoice source", () => {
    expect(
      toPdfFilenameMeta({
        receiver: { name: "Client Name" },
        details: { invoiceNumber: "INV-101", documentType: "invoice" },
      })
    ).toEqual({
      recipientName: "Client Name",
      invoiceNumber: "INV-101",
      documentType: "invoice",
    });
  });
});
