import { NextRequest } from "next/server";

import {
  invoiceExportQuerySchema,
  invoiceExportRequestSchema,
} from "@/lib/contracts/invoiceApi";
import { HttpError, toHttpErrorResponse } from "@/lib/server/httpError";

// Services
import { exportInvoiceService } from "@/services/invoice/server/exportInvoiceService";

export async function POST(req: NextRequest) {
  try {
    const rawFormat = req.nextUrl.searchParams.get("format") ?? "";
    const query = invoiceExportQuerySchema.safeParse({
      format: rawFormat,
    });

    if (!query.success) {
      throw new HttpError({
        status: 400,
        code: "validation_error",
        message: "Invalid export format",
        details: query.error.flatten(),
      });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new HttpError({
        status: 400,
        code: "invalid_json",
        message: "Request body must be valid JSON",
      });
    }

    const parsed = invoiceExportRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new HttpError({
        status: 400,
        code: "validation_error",
        message: "Invalid export payload",
        details: parsed.error.flatten(),
      });
    }

    return await exportInvoiceService({
      body: parsed.data,
      format: query.data.format,
    });
  } catch (error) {
    return toHttpErrorResponse(error, {
      code: "export_invoice_error",
      message: "Failed to export invoice",
    });
  }
}
