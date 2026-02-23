import { expect, test, type Page } from "@playwright/test";

const DRAFT_KEY = "invoify:invoiceDraft";

const toTestId = (invoiceNumber: string) =>
  invoiceNumber.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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

type DraftInitPayload = {
  draftValue: ReturnType<typeof createDraft>;
  draftKey: string;
};

const installDraft = async (invoiceNumber: string, page: Page) => {
  const draft = createDraft(invoiceNumber);
  await page.addInitScript(
    ({ draftValue, draftKey }: DraftInitPayload) => {
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

test.describe("invoice workflow", () => {
  test("save/load/duplicate/status/cache-restore flow", async ({ page }) => {
    const invoiceNumber = "INV-1001";
    const invoiceId = toTestId(invoiceNumber);
    let generateCallCount = 0;
    let allowGenerate = true;

    await installDraft(invoiceNumber, page);

    await page.route("**/api/invoice/generate", async (route) => {
      generateCallCount += 1;

      if (!allowGenerate) {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: "forced test failure" }),
          headers: {
            "content-type": "application/json",
          },
        });
        return;
      }

      const mockPdf = "%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF";
      await route.fulfill({
        status: 200,
        body: mockPdf,
        headers: {
          "content-type": "application/pdf",
        },
      });
    });

    await page.route("**/api/invoice/send", async (route) => {
      await route.fulfill({
        status: 200,
        body: "Email sent successfully",
      });
    });

    await page.goto("/en");

    await page.getByRole("button", { name: /5\.\s*Summary/i }).click();
    await page.getByTestId("generate-pdf-btn").click();
    await expect(page.getByText("Final PDF:")).toBeVisible();

    await page.getByTestId("save-invoice-btn").click();

    await page.getByTestId("send-to-mail-btn").click();
    await page.getByTestId("send-email-input").fill("client@example.com");
    await page.getByTestId("confirm-send-email-btn").click();

    await page.getByTestId("load-invoice-btn").click();
    const originalCard = page.getByTestId(`saved-invoice-card-${invoiceId}`);

    await expect(page.getByTestId("saved-invoices-search")).toBeVisible();
    await expect(page.getByTestId("saved-invoices-status-filter")).toBeVisible();
    await expect(page.getByTestId("saved-invoices-sort")).toBeVisible();

    await page.getByTestId("saved-invoices-search").fill("does-not-exist");
    await expect(page.getByText("No invoices match your filters.")).toBeVisible();
    await page.getByTestId("saved-invoices-search").fill(invoiceNumber);

    await page.getByTestId("saved-invoices-status-filter").click();
    await page.getByRole("option", { name: "Sent" }).click();
    await expect(originalCard).toBeVisible();
    await page.getByTestId("saved-invoices-status-filter").click();
    await page.getByRole("option", { name: "All statuses" }).click();

    await page.getByTestId("saved-invoices-sort").click();
    await page.getByRole("option", { name: "Total (high to low)" }).click();

    await expect(originalCard).toBeVisible();
    await expect(originalCard.getByText("Sent")).toBeVisible();

    await originalCard.getByTestId(`saved-invoice-mark-paid-${invoiceId}`).click();
    await expect(originalCard.getByText("Paid")).toBeVisible();

    await originalCard.getByTestId(`saved-invoice-duplicate-${invoiceId}`).click();
    await expect(page.getByTestId("saved-invoice-card-inv-1001-copy")).toBeVisible();

    allowGenerate = false;
    await page.reload();

    await page.getByTestId("load-invoice-btn").click();
    await page
      .getByTestId(`saved-invoice-load-generate-${invoiceId}`)
      .click();

    await expect(page.getByText("Final PDF:")).toBeVisible();
    expect(generateCallCount).toBe(1);
  });

  test("customer template save/apply/rename/delete flow", async ({ page }) => {
    const invoiceNumber = "INV-TEMPLATE-1";
    await installDraft(invoiceNumber, page);

    await page.goto("/en");

    await page
      .getByPlaceholder("Your name")
      .fill("Template Sender");
    await page
      .getByPlaceholder("Receiver name")
      .fill("Template Receiver");

    await page.getByTestId("customer-template-name-input").fill("Main Client");
    await page.getByTestId("customer-template-save-btn").click();

    await page
      .getByPlaceholder("Your name")
      .fill("Mutated Sender");
    await page
      .getByPlaceholder("Receiver name")
      .fill("Mutated Receiver");

    await page.getByTestId("customer-template-select-trigger").click();
    await page.getByRole("option", { name: "Main Client" }).click();
    await page.getByTestId("customer-template-apply-btn").click();

    await expect(page.getByPlaceholder("Your name")).toHaveValue("Template Sender");
    await expect(page.getByPlaceholder("Receiver name")).toHaveValue(
      "Template Receiver"
    );

    await page
      .getByTestId("customer-template-name-input")
      .fill("Main Client Renamed");
    await page.getByTestId("customer-template-rename-btn").click();

    await page.getByTestId("customer-template-select-trigger").click();
    await expect(
      page.getByRole("option", { name: "Main Client Renamed" })
    ).toBeVisible();
    await page.getByRole("option", { name: "Main Client Renamed" }).click();

    await page.getByTestId("customer-template-delete-btn").click();
    await expect(page.getByText("No saved templates yet.")).toBeVisible();
  });
});
