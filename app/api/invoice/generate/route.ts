export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest } from "next/server";

import { invoiceGenerateRequestSchema } from "@/lib/contracts/invoiceApi";
import { HttpError, toHttpErrorResponse } from "@/lib/server/httpError";

// Services
import { generatePdfService } from "@/services/invoice/server/generatePdfService";

export async function POST(req: NextRequest) {
  try {
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

    const parsed = invoiceGenerateRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new HttpError({
        status: 400,
        code: "validation_error",
        message: "Invalid invoice payload",
        details: parsed.error.flatten(),
      });
    }

    return await generatePdfService(parsed.data);
  } catch (error) {
    return toHttpErrorResponse(error, {
      code: "generate_pdf_error",
      message: "Failed to generate PDF",
    });
  }
}
