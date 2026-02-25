import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MAX_EMAIL_ATTACHMENT_BYTES } from "@/lib/contracts/invoiceApi";

const { sendPdfToEmailServiceMock } = vi.hoisted(() => ({
  sendPdfToEmailServiceMock: vi.fn(),
}));

vi.mock("@/services/invoice/server/sendPdfToEmailService", () => ({
  sendPdfToEmailService: sendPdfToEmailServiceMock,
}));

import { POST } from "@/app/api/invoice/send/route";

const toRequest = (formData: FormData): NextRequest => {
  return {
    formData: async () => formData,
  } as NextRequest;
};

describe("/api/invoice/send", () => {
  beforeEach(() => {
    sendPdfToEmailServiceMock.mockReset();
  });

  it("returns validation error when PDF file is missing", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("invoiceNumber", "INV-1");

    const req = toRequest(formData);

    const res = await POST(req);
    const payload = await res.json();

    expect(res.status).toBe(400);
    expect(payload.error.code).toBe("validation_error");
    expect(sendPdfToEmailServiceMock).not.toHaveBeenCalled();
  });

  it("returns validation error for invalid email", async () => {
    const formData = new FormData();
    formData.set("email", "invalid-email");
    formData.set("invoiceNumber", "INV-1");
    formData.set(
      "invoicePdf",
      new File(["pdf-content"], "invoice.pdf", { type: "application/pdf" })
    );

    const req = toRequest(formData);

    const res = await POST(req);
    const payload = await res.json();

    expect(res.status).toBe(400);
    expect(payload.error.code).toBe("validation_error");
    expect(payload.error.details.maxAttachmentBytes).toBe(MAX_EMAIL_ATTACHMENT_BYTES);
    expect(sendPdfToEmailServiceMock).not.toHaveBeenCalled();
  });

  it("returns validation error for oversized attachment", async () => {
    const oversizedFile = new File(
      [new Uint8Array(MAX_EMAIL_ATTACHMENT_BYTES + 1)],
      "invoice.pdf",
      {
        type: "application/pdf",
      }
    );

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("invoiceNumber", "INV-1");
    formData.set("invoicePdf", oversizedFile);

    const req = toRequest(formData);

    const res = await POST(req);
    const payload = await res.json();

    expect(res.status).toBe(400);
    expect(payload.error.code).toBe("validation_error");
    expect(sendPdfToEmailServiceMock).not.toHaveBeenCalled();
  });

  it("calls email service for valid payload", async () => {
    sendPdfToEmailServiceMock.mockResolvedValueOnce(undefined);

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("invoiceNumber", "INV-1");
    formData.set(
      "invoicePdf",
      new File(["pdf-content"], "invoice.pdf", { type: "application/pdf" })
    );

    const req = toRequest(formData);

    const res = await POST(req);
    const payload = await res.json();

    expect(res.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(sendPdfToEmailServiceMock).toHaveBeenCalledTimes(1);
    expect(sendPdfToEmailServiceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        invoiceNumber: "INV-1",
      })
    );
  });

  it("passes optional email content fields to service", async () => {
    sendPdfToEmailServiceMock.mockResolvedValueOnce(undefined);

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("invoiceNumber", "INV-2");
    formData.set("subject", "Custom subject");
    formData.set("body", "Custom body line");
    formData.set("footer", "Ray Harrison");
    formData.set(
      "invoicePdf",
      new File(["pdf-content"], "client_invoice.pdf", { type: "application/pdf" })
    );

    const req = toRequest(formData);
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(sendPdfToEmailServiceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        invoiceNumber: "INV-2",
        subject: "Custom subject",
        body: "Custom body line",
        footer: "Ray Harrison",
      })
    );
  });
});
