import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

import {
  invoiceSendRequestSchema,
  MAX_EMAIL_ATTACHMENT_BYTES,
} from "@/lib/contracts/invoiceApi";
import { HttpError, toHttpErrorResponse } from "@/lib/server/httpError";

// Services
import { sendPdfToEmailService } from "@/services/invoice/server/sendPdfToEmailService";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();

    const email = fd.get("email");
    const subject = fd.get("subject");
    const body = fd.get("body");
    const footer = fd.get("footer");
    const invoicePdf = fd.get("invoicePdf");
    const invoiceNumber = fd.get("invoiceNumber");

    const toOptionalFormValue = (value: FormDataEntryValue | null) => {
      if (typeof value !== "string") return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    };

    if (!(invoicePdf instanceof File)) {
      throw new HttpError({
        status: 400,
        code: "validation_error",
        message: "invoicePdf file is required",
      });
    }

    const parsed = invoiceSendRequestSchema.safeParse({
      email: typeof email === "string" ? email : "",
      invoiceNumber: typeof invoiceNumber === "string" ? invoiceNumber : "",
      subject: toOptionalFormValue(subject),
      body: toOptionalFormValue(body),
      footer: toOptionalFormValue(footer),
      attachmentSizeBytes: invoicePdf.size,
    });

    if (!parsed.success) {
      throw new HttpError({
        status: 400,
        code: "validation_error",
        message: "Invalid send-email payload",
        details: {
          ...parsed.error.flatten(),
          maxAttachmentBytes: MAX_EMAIL_ATTACHMENT_BYTES,
        },
      });
    }

    await sendPdfToEmailService({
      email: parsed.data.email,
      invoiceNumber: parsed.data.invoiceNumber,
      subject: parsed.data.subject,
      body: parsed.data.body,
      footer: parsed.data.footer,
      invoicePdf,
    });

    return NextResponse.json({
      ok: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    const shouldReportServerError =
      !(err instanceof HttpError) || err.status >= 500;

    if (shouldReportServerError) {
      console.error("Email service error:", err);
      Sentry.captureException(err, {
        tags: {
          route: "/api/invoice/send",
        },
      });
    }
    return toHttpErrorResponse(err, {
      code: "send_email_error",
      message: "Failed to send email",
    });
  }
}
