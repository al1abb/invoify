import { expect, test, type Page } from "@playwright/test";

const DRAFT_KEY = "invoify:invoiceDraft";
const DRAFT_KEY_V2 = "invoify:invoiceDraft:v2";
const MOCK_PDF =
  "%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF";

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
      dueDate: "2020-03-20T00:00:00.000Z",
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

const createLegacyDraftMissingChargeTypes = (invoiceNumber: string) => {
  const draft = JSON.parse(JSON.stringify(createDraft(invoiceNumber))) as {
    details?: {
      discountDetails?: Record<string, unknown>;
      taxDetails?: Record<string, unknown>;
      shippingDetails?: Record<string, unknown>;
    };
  };

  if (draft.details?.discountDetails) {
    delete draft.details.discountDetails.amountType;
  }

  if (draft.details?.taxDetails) {
    delete draft.details.taxDetails.amountType;
  }

  if (draft.details?.shippingDetails) {
    delete draft.details.shippingDetails.costType;
  }

  return draft as ReturnType<typeof createDraft>;
};

const installDraftPayload = async (
  draft: ReturnType<typeof createDraft>,
  page: Page
) => {
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

const installDraft = async (invoiceNumber: string, page: Page) => {
  const draft = createDraft(invoiceNumber);
  await installDraftPayload(draft, page);
};

const waitForDraftHydration = async (page: Page) => {
  await expect(page.getByPlaceholder("Your name")).toHaveValue("Alpha Sender");
  await expect(page.getByPlaceholder("Receiver name")).toHaveValue(
    "Beta Receiver"
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

      await route.fulfill({
        status: 200,
        body: MOCK_PDF,
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
    await waitForDraftHydration(page);

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
    await expect(originalCard.getByText("Sent", { exact: true })).toBeVisible();

    const paymentInput = originalCard.getByTestId(
      `saved-invoice-payment-input-${invoiceId}`
    );
    await paymentInput.fill("250");
    await originalCard.getByTestId(`saved-invoice-record-payment-${invoiceId}`).click();
    await expect(paymentInput).toHaveValue("");

    await originalCard.getByTestId(`saved-invoice-recurring-${invoiceId}`).click();
    await page.getByRole("option", { name: "Recurring: Weekly" }).click();
    await expect(
      originalCard.getByTestId(`saved-invoice-generate-next-${invoiceId}`)
    ).toBeVisible();
    await originalCard.getByTestId(`saved-invoice-generate-next-${invoiceId}`).click();
    await expect(page.getByTestId("saved-invoice-card-inv-1001-r1")).toBeVisible();

    await originalCard.getByTestId(`saved-invoice-send-reminder-${invoiceId}`).click();
    await expect(originalCard.getByText("Last reminder:")).toBeVisible();

    await originalCard.getByTestId(`saved-invoice-mark-paid-${invoiceId}`).click();
    await expect(originalCard.getByText("Paid", { exact: true })).toBeVisible();

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

  test("send email error shows actionable API message", async ({ page }) => {
    await installDraft("INV-SEND-ERROR-1", page);

    await page.route("**/api/invoice/generate", async (route) => {
      await route.fulfill({
        status: 200,
        body: MOCK_PDF,
        headers: {
          "content-type": "application/pdf",
        },
      });
    });

    await page.route("**/api/invoice/send", async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({
          error: {
            code: "validation_error",
            message: "Recipient mailbox rejected by test",
          },
        }),
        headers: {
          "content-type": "application/json",
        },
      });
    });

    await page.goto("/en");
    await waitForDraftHydration(page);

    await page.getByRole("button", { name: /5\.\s*Summary/i }).click();
    await page.getByTestId("generate-pdf-btn").click();
    await expect(page.getByText("Final PDF:")).toBeVisible();

    await page.getByTestId("send-to-mail-btn").click();
    await page.getByTestId("send-email-input").fill("client@example.com");
    await page.getByTestId("confirm-send-email-btn").click();

    await expect(
      page.getByText("Recipient mailbox rejected by test", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("export error shows actionable API message", async ({ page }) => {
    await installDraft("INV-EXPORT-ERROR-1", page);

    await page.route("**/api/invoice/export**", async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({
          error: {
            code: "validation_error",
            message: "Export payload invalid in test",
          },
        }),
        headers: {
          "content-type": "application/json",
        },
      });
    });

    await page.goto("/en");
    await waitForDraftHydration(page);

    await page.getByTestId("export-invoice-btn").click();
    await page.getByRole("button", { name: "Export as JSON" }).click();

    await expect(
      page.getByText("Export payload invalid in test", { exact: true })
    ).toBeVisible();
  });

  test("legacy draft missing charge amount types does not crash on startup", async ({
    page,
  }) => {
    await installDraftPayload(
      createLegacyDraftMissingChargeTypes("INV-LEGACY-CHARGES"),
      page
    );

    const pageErrors: string[] = [];
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    await page.goto("/en");
    await waitForDraftHydration(page);

    await page.waitForTimeout(1200);
    expect(
      pageErrors.some((message) =>
        message.includes("Maximum update depth exceeded")
      )
    ).toBeFalsy();
  });

  test("corrupted v2 draft payload is recovered without startup crash", async ({
    page,
  }) => {
    await page.addInitScript((draftKeyV2: string) => {
      window.localStorage.setItem(draftKeyV2, "{bad-json");
    }, DRAFT_KEY_V2);

    const pageErrors: string[] = [];
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    await page.goto("/en");
    await expect(page.getByPlaceholder("Your name")).toBeVisible();
    await page.waitForTimeout(1200);

    expect(
      pageErrors.some((message) =>
        message.includes("Maximum update depth exceeded")
      )
    ).toBeFalsy();

    const hasDraftBackup = await page.evaluate(() =>
      Object.keys(window.localStorage).some((key) =>
        key.startsWith("invoify:backup:invoice_draft:")
      )
    );

    expect(hasDraftBackup).toBe(true);
  });

  test("download filename is tied to generated PDF and uses client_name_invoice format", async ({
    page,
  }) => {
    await installDraft("INV-FILENAME-1", page);

    await page.route("**/api/invoice/generate", async (route) => {
      await route.fulfill({
        status: 200,
        body: MOCK_PDF,
        headers: {
          "content-type": "application/pdf",
        },
      });
    });

    await page.goto("/en");
    await waitForDraftHydration(page);

    const generatedRecipientName = "Acme Receiver";
    const generatedInvoiceNumber = `INV-${"9".repeat(70)}`;
    const expectedRecipientName = "Acme_Receiver";
    const expectedInvoiceNumber = generatedInvoiceNumber.slice(0, 48);

    await page.getByRole("button", { name: /^1\./ }).click();
    await page.getByPlaceholder("Receiver name").fill(generatedRecipientName);

    await page.getByRole("button", { name: /^2\./ }).click();
    await page.getByPlaceholder("Invoice number").fill(generatedInvoiceNumber);

    await page.getByRole("button", { name: /5\.\s*Summary/i }).click();
    await page.getByTestId("generate-pdf-btn").click();
    await expect(page.getByText("Final PDF:")).toBeVisible();

    await page.getByRole("button", { name: /^1\./ }).click();
    await page.getByPlaceholder("Receiver name").fill("Mutated Receiver");

    await page.getByRole("button", { name: /^2\./ }).click();
    await page.getByPlaceholder("Invoice number").fill("MUTATED-INV-999");

    await page.getByRole("button", { name: /5\.\s*Summary/i }).click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("download-pdf-btn").click(),
    ]);

    expect(download.suggestedFilename()).toBe(
      `${expectedRecipientName}_Invoice_${expectedInvoiceNumber}.pdf`
    );
  });

  test("customer template save/apply/rename/delete flow", async ({ page }) => {
    const invoiceNumber = "INV-TEMPLATE-1";
    await installDraft(invoiceNumber, page);

    await page.goto("/en");
    await waitForDraftHydration(page);

    const senderNameInput = page.getByPlaceholder("Your name");
    const receiverNameInput = page.getByPlaceholder("Receiver name");
    const templateSelectTrigger = page.getByTestId(
      "customer-template-select-trigger"
    );
    const applyTemplateButton = page.getByTestId("customer-template-apply-btn");

    await senderNameInput.fill("Template Sender");
    await receiverNameInput.fill("Template Receiver");

    await page.getByTestId("customer-template-name-input").fill("Main Client");
    await page.getByTestId("customer-template-save-btn").click();

    await senderNameInput.fill("Mutated Sender");
    await receiverNameInput.fill("Mutated Receiver");

    await templateSelectTrigger.click();
    await page.getByRole("option", { name: "Main Client" }).click();
    await expect(applyTemplateButton).toBeEnabled();
    await applyTemplateButton.click();

    await expect(senderNameInput).toHaveValue("Template Sender");
    await expect(receiverNameInput).toHaveValue("Template Receiver");

    await page
      .getByTestId("customer-template-name-input")
      .fill("Main Client Renamed");
    await page.getByTestId("customer-template-rename-btn").click();

    await templateSelectTrigger.click();
    await expect(
      page.getByRole("option", { name: "Main Client Renamed" })
    ).toBeVisible();
    await page.getByRole("option", { name: "Main Client Renamed" }).click();

    await page.getByTestId("customer-template-delete-btn").click();
    await expect(page.getByText("No saved templates yet.")).toBeVisible();
  });
});
