import { describe, expect, it } from "vitest";

import {
  applyUserPreferencesToInvoice,
  getDefaultUserPreferences,
  readUserPreferences,
  updateUserPreferences,
  USER_PREFERENCES_KEY_V1,
  writeUserPreferences,
} from "@/lib/storage/userPreferences";
import { FORM_DEFAULT_VALUES } from "@/lib/variables";
import { InvoiceType } from "@/types";

describe("user preferences storage", () => {
  it("returns defaults when no value is stored", () => {
    expect(readUserPreferences()).toEqual(getDefaultUserPreferences());
  });

  it("writes and updates stored preferences", () => {
    const wrote = writeUserPreferences({
      defaultCurrency: "EUR",
      defaultTemplateId: 2,
      defaultLocale: "de",
    });

    expect(wrote).toBe(true);
    expect(readUserPreferences()).toEqual({
      defaultCurrency: "EUR",
      defaultTemplateId: 2,
      defaultLocale: "de",
    });

    const updated = updateUserPreferences({
      defaultCurrency: "GBP",
    });

    expect(updated).toBe(true);
    expect(readUserPreferences()).toEqual({
      defaultCurrency: "GBP",
      defaultTemplateId: 2,
      defaultLocale: "de",
    });
  });

  it("recovers from corrupted payload", () => {
    window.localStorage.setItem(USER_PREFERENCES_KEY_V1, "{bad-json");

    const preferences = readUserPreferences();

    expect(preferences).toEqual(getDefaultUserPreferences());

    const backupKey = Object.keys(window.localStorage).find((key) =>
      key.startsWith("invoify:backup:user_preferences:")
    );
    expect(backupKey).toBeTruthy();
  });

  it("applies preferences to a new invoice", () => {
    const invoice = JSON.parse(JSON.stringify(FORM_DEFAULT_VALUES)) as InvoiceType;

    const next = applyUserPreferencesToInvoice(invoice, {
      defaultCurrency: "CAD",
      defaultTemplateId: 2,
      defaultLocale: "fr",
    });

    expect(next.details.currency).toBe("CAD");
    expect(next.details.pdfTemplate).toBe(2);
    expect(next.details.language).toBe("fr");
  });
});
