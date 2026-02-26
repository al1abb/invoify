import { describe, expect, it } from "vitest";

import {
  normalizeDocumentType,
  toDocumentTypeLabel,
  toInvoiceNumberFromQuote,
} from "@/lib/invoice/documentType";

describe("document type helpers", () => {
  it("normalizes unknown values to invoice", () => {
    expect(normalizeDocumentType(undefined)).toBe("invoice");
    expect(normalizeDocumentType("")).toBe("invoice");
    expect(normalizeDocumentType("invoice")).toBe("invoice");
  });

  it("preserves quote values", () => {
    expect(normalizeDocumentType("quote")).toBe("quote");
    expect(toDocumentTypeLabel("quote")).toBe("Quote");
    expect(toDocumentTypeLabel("invoice")).toBe("Invoice");
  });

  it("converts common quote prefixes to invoice prefix", () => {
    expect(toInvoiceNumberFromQuote("QTE-1001")).toBe("INV-1001");
    expect(toInvoiceNumberFromQuote("quote_1002")).toBe("INV-1002");
    expect(toInvoiceNumberFromQuote("estimate 1003")).toBe("INV-1003");
  });

  it("keeps invoice numbers unchanged when no quote prefix exists", () => {
    expect(toInvoiceNumberFromQuote("2026-03")).toBe("2026-03");
  });
});
