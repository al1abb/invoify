import { NextResponse } from "next/server";

// JSON2CSV
import { AsyncParser } from "@json2csv/node";

// XML2JS
import { Builder } from "xml2js";

// Types
import { ExportTypes } from "@/types";
import { InvoiceType } from "@/types";
import { HttpError } from "@/lib/server/httpError";

type ExportInvoiceServiceArgs = {
  body: InvoiceType;
  format: ExportTypes;
};

/**
 * Export an invoice in selected format.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} A response object containing the exported data in the requested format.
 */
export async function exportInvoiceService({
  body,
  format,
}: ExportInvoiceServiceArgs) {
  try {
    switch (format) {
      case ExportTypes.JSON: {
        const jsonData = JSON.stringify(body);
        return new NextResponse(jsonData, {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": "attachment; filename=invoice.json",
          },
          status: 200,
        });
      }
      case ExportTypes.CSV: {
        const parser = new AsyncParser();
        const csv = await parser.parse(body).promise();
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=invoice.csv",
          },
        });
      }
      case ExportTypes.XML: {
        const builder = new Builder();
        const xml = builder.buildObject(body);
        return new NextResponse(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Content-Disposition": "attachment; filename=invoice.xml",
          },
        });
      }
      default:
        throw new HttpError({
          status: 400,
          code: "unsupported_export_format",
          message: "Unsupported export format",
        });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) throw error;
    throw new HttpError({
      status: 500,
      code: "export_failed",
      message: "Failed to export invoice",
    });
  }
}
