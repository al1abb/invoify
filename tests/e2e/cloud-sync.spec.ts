import { expect, test, type Page } from "@playwright/test";

const DRAFT_KEY = "invoify:invoiceDraft";

const createDraft = (invoiceNumber: string) => ({
  sender: {
    name: "Alpha Sender",
    address: "123 Main St",
    zipCode: "12345",
    city: "Austin",
    country: "USA",
    email: "sender@example.com",
    phone: "111-111-1111",
    customInputs: [],
  },
  receiver: {
    name: "Beta Receiver",
    address: "55 River Rd",
    zipCode: "90210",
    city: "Los Angeles",
    country: "USA",
    email: "receiver@example.com",
    phone: "222-222-2222",
    customInputs: [],
  },
  details: {
    invoiceLogo: "",
    invoiceNumber,
    invoiceDate: "2026-02-20T00:00:00.000Z",
    dueDate: "2026-03-20T00:00:00.000Z",
    items: [
      {
        name: "Contract Work",
        description: "Phase 1",
        quantity: 2,
        unitPrice: 500,
        total: 1000,
      },
    ],
    currency: "USD",
    language: "English",
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
    paymentInformation: {
      bankName: "Bank One",
      accountName: "Alpha Sender",
      accountNumber: "123456789",
    },
    additionalNotes: "Thank you",
    paymentTerms: "Net 30",
    totalAmountInWords: "One thousand",
    subTotal: 1000,
    totalAmount: 1000,
    pdfTemplate: 1,
  },
});

const installDraft = async (invoiceNumber: string, page: Page) => {
  const draft = createDraft(invoiceNumber);
  await page.addInitScript(
    ({ draftValue, draftKey }) => {
      if (!window.localStorage.getItem(draftKey)) {
        window.localStorage.setItem(draftKey, JSON.stringify(draftValue));
      }
    },
    {
      draftValue: draft,
      draftKey: DRAFT_KEY,
    }
  );
};

test.describe("cloud sync", () => {
  test("unauthenticated sync is skipped, then sign in reaches up-to-date status", async ({
    page,
  }) => {
    const email = process.env.E2E_SUPABASE_EMAIL || "";
    const password = process.env.E2E_SUPABASE_PASSWORD || "";
    test.skip(
      !email || !password,
      "Set E2E_SUPABASE_EMAIL and E2E_SUPABASE_PASSWORD to run cloud sync test."
    );

    await installDraft("INV-SYNC-1001", page);
    await page.goto("/en");

    const signOutButton = page.getByTestId("auth-signout-btn");
    if (await signOutButton.isVisible()) {
      await signOutButton.click();
    }

    await expect(page.getByTestId("sync-status-badge")).toHaveText("Skipped", {
      timeout: 45_000,
    });
    await expect(
      page.getByText("Reason: No access token in session")
    ).toBeVisible({
      timeout: 45_000,
    });

    await page.getByTestId("auth-open-btn").click();
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByTestId("auth-submit-btn").click();

    await expect(page.getByTestId("auth-signout-btn")).toBeVisible();

    await page.getByPlaceholder("Your name").fill("Sync Sender");
    await page.getByPlaceholder("Receiver name").fill("Sync Receiver");
    await page.getByTestId("customer-template-name-input").fill("Sync Template");
    await page.getByTestId("customer-template-save-btn").click();

    await expect(page.getByTestId("sync-status-badge")).toHaveText("Up to date", {
      timeout: 45_000,
    });
    await expect(page.getByText("Reason: None")).toBeVisible();
  });
});
