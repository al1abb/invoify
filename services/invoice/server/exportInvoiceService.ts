import { NextRequest, NextResponse } from "next/server";

// JSON2CSV
import { AsyncParser } from "@json2csv/node";

// XML2JS
import { Builder } from "xml2js";

// XLSX (require for CJS interop; xlsx has no ESM default export)
// eslint-disable-next-line @typescript-eslint/no-require-imports -- xlsx 0.18.5 CJS module
const XLSX = require("xlsx");

// Helpers
import { flattenObject } from "@/lib/helpers";

// Types
import { ExportTypes } from "@/types";

/**
 * Export an invoice in selected format.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} A response object containing the exported data in the requested format.
 */
export async function exportInvoiceService(req: NextRequest) {
    const body = await req.json();
    const format = req.nextUrl.searchParams.get("format");

    try {
        switch (format) {
            case ExportTypes.JSON:
                const jsonData = JSON.stringify(body);
                return new NextResponse(jsonData, {
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Disposition":
                            "attachment; filename=invoice.json",
                    },
                    status: 200,
                });
            case ExportTypes.CSV:
                //? Can pass specific fields to async parser. Empty = All
                const parser = new AsyncParser();
                const csv = await parser.parse(body).promise();
                return new NextResponse(csv, {
                    headers: {
                        "Content-Type": "text/csv",
                        "Content-Disposition":
                            "attachment; filename=invoice.csv",
                    },
                });
            case ExportTypes.XML:
                // Convert JSON to XML
                const builder = new Builder();
                const xml = builder.buildObject(body);
                return new NextResponse(xml, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Content-Disposition":
                            "attachment; filename=invoice.xml",
                    },
                });
            case ExportTypes.XLSX: {
                const { sender, receiver, details } = body;
                const { items, ...detailsWithoutItems } = details ?? {};
                const metadataObj = {
                    sender: sender ?? {},
                    receiver: receiver ?? {},
                    details: detailsWithoutItems ?? {},
                };
                const metadataRow = flattenObject(
                    metadataObj as Record<string, unknown>
                );
                const invoiceSheet = XLSX.utils.json_to_sheet([metadataRow]);
                const itemsSheet = XLSX.utils.json_to_sheet(
                    Array.isArray(items) ? items : []
                );
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, invoiceSheet, "Invoice");
                XLSX.utils.book_append_sheet(workbook, itemsSheet, "Items");
                const buffer = XLSX.write(workbook, {
                    bookType: "xlsx",
                    type: "buffer",
                });
                return new NextResponse(buffer, {
                    headers: {
                        "Content-Type":
                            "text/csv",
                        "Content-Disposition":
                            "attachment; filename=invoice.csv",
                    },
                });
            }
            default:
                return NextResponse.json(
                    { error: "Unsupported export format" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error(error);

        // Return an error response
        return new Response(`Error exporting: \n${error}`, {
            status: 500,
        });
    }
}
