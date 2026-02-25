import { describe, expect, it } from "vitest";

import {
  clearInvoiceDraft,
  INVOICE_DRAFT_KEY_V2,
  readInvoiceDraft,
  writeInvoiceDraft,
} from "@/lib/storage/invoiceDraft";
import { LOCAL_STORAGE_INVOICE_DRAFT_KEY } from "@/lib/variables";

describe("invoice draft storage", () => {
  it("migrates legacy draft payload to v2 envelope", () => {
    window.localStorage.setItem(
      LOCAL_STORAGE_INVOICE_DRAFT_KEY,
      JSON.stringify({
        details: {
          invoiceNumber: "INV-900",
          currency: "EUR",
          invoiceDate: "2026-01-15",
          dueDate: "2026-01-22",
        },
      })
    );

    const result = readInvoiceDraft();

    expect(result.migrated).toBe(true);
    expect(result.corruptionRecovered).toBe(false);
    expect(result.draft?.details.invoiceNumber).toBe("INV-900");
    expect(window.localStorage.getItem(LOCAL_STORAGE_INVOICE_DRAFT_KEY)).toBeNull();

    const migratedRaw = window.localStorage.getItem(INVOICE_DRAFT_KEY_V2);
    expect(migratedRaw).not.toBeNull();

    const migrated = JSON.parse(String(migratedRaw));
    expect(migrated.version).toBe(2);
    expect(migrated.data.details.invoiceNumber).toBe("INV-900");
  });

  it("backs up corrupted v2 draft payload and recovers safely", () => {
    window.localStorage.setItem(INVOICE_DRAFT_KEY_V2, "{not-json");

    const result = readInvoiceDraft();

    expect(result.draft).toBeNull();
    expect(result.corruptionRecovered).toBe(true);
    expect(result.backupKey).toContain("invoify:backup:invoice_draft:");
    expect(window.localStorage.getItem(INVOICE_DRAFT_KEY_V2)).toBeNull();
    expect(window.localStorage.getItem(String(result.backupKey))).toBe("{not-json");
  });

  it("writes and clears draft through adapter", () => {
    const wrote = writeInvoiceDraft({
      details: {
        invoiceNumber: "INV-901",
      },
    });

    expect(wrote).toBe(true);
    expect(window.localStorage.getItem(INVOICE_DRAFT_KEY_V2)).not.toBeNull();

    const cleared = clearInvoiceDraft();
    expect(cleared).toBe(true);
    expect(window.localStorage.getItem(INVOICE_DRAFT_KEY_V2)).toBeNull();
  });
});
