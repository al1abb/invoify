import * as Sentry from "@sentry/nextjs";

// Nodemailer
import nodemailer, { SendMailOptions } from "nodemailer";

// React-email
import { render } from "@react-email/render";

// Templates
import SendPdfEmail from "@/app/components/templates/email/SendPdfEmail";

// Helpers
import { fileToBuffer } from "@/lib/helpers/server";

// Variables
import {
  SMTP_FROM,
  SMTP_FROM_EMAIL,
  SMTP_FROM_NAME,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_URL,
  SMTP_USER,
} from "@/lib/variables";
import { HttpError } from "@/lib/server/httpError";

const toBoolean = (value: string | undefined) => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
};

const getSmtpPort = () => {
  const parsed = Number(SMTP_PORT);
  if (Number.isInteger(parsed) && parsed > 0) return parsed;
  return null;
};

const getTransporter = () => {
  if (SMTP_URL) {
    return nodemailer.createTransport(SMTP_URL);
  }

  const smtpPort = getSmtpPort();
  if (SMTP_HOST && smtpPort && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: smtpPort,
      secure: toBoolean(SMTP_SECURE),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return null;
};

const resolveFromAddress = () => {
  if (SMTP_FROM) return SMTP_FROM;
  if (SMTP_FROM_NAME && SMTP_FROM_EMAIL) {
    return `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`;
  }
  if (SMTP_FROM_EMAIL) return SMTP_FROM_EMAIL;
  return SMTP_USER || "Invoify";
};

const transporter = getTransporter();

const isEmailConfigured = () => {
  return Boolean(transporter);
};

const EMAIL_CONFIGURATION_ERROR_MESSAGE =
  "Email service not configured. Provide SMTP_URL, or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.";

type SendPdfToEmailArgs = {
  email: string;
  invoicePdf: File;
  invoiceNumber: string;
  subject?: string;
  body?: string;
  footer?: string;
};

/**
 * Send a PDF as an email attachment.
 */
export async function sendPdfToEmailService({
  email,
  invoicePdf,
  invoiceNumber,
  subject,
  body,
  footer,
}: SendPdfToEmailArgs): Promise<void> {
  if (!isEmailConfigured() || !transporter) {
    console.error(EMAIL_CONFIGURATION_ERROR_MESSAGE);
    throw new HttpError({
      status: 500,
      code: "email_not_configured",
      message: EMAIL_CONFIGURATION_ERROR_MESSAGE,
    });
  }

  const emailHTML = await render(
    SendPdfEmail({
      invoiceNumber,
      body,
      footer,
    })
  );
  const invoiceBuffer = await fileToBuffer(invoicePdf);

  try {
    const attachmentFilename =
      typeof invoicePdf.name === "string" && invoicePdf.name.trim()
        ? invoicePdf.name.trim()
        : "invoice.pdf";

    const mailOptions: SendMailOptions = {
      from: resolveFromAddress(),
      to: email,
      subject: subject?.trim() || `Invoice Ready: #${invoiceNumber}`,
      html: emailHTML,
      attachments: [
        {
          filename: attachmentFilename,
          content: invoiceBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email", error);
    Sentry.captureException(error, {
      tags: {
        service: "sendPdfToEmailService",
      },
    });
    throw new HttpError({
      status: 500,
      code: "email_send_failed",
      message: "Failed to send email",
    });
  }
}
