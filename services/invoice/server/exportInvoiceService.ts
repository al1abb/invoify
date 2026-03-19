import { NextRequest, NextResponse } from "next/server";

// JSON2CSV
import { AsyncParser } from "@json2csv/node";

// XML2JS
import { Builder } from "xml2js";

// XLSX
import { utils as xlsxUtils, write as xlsxWrite } from "xlsx";

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
                const sender = body?.sender ?? {};
                const receiver = body?.receiver ?? {};
                const details = body?.details ?? {};
                const rows: (string | number)[][] = [
                    ["Invoice", details.invoiceNumber ?? "", "Date", details.invoiceDate ?? "", "Due Date", details.dueDate ?? ""],
                    ["From", sender.name ?? "", "", "", "To", receiver.name ?? ""],
                    [],
                    ["Name", "Description", "Qty", "Unit Price", "Total"],
                ];
                for (const item of details.items ?? []) {
                    rows.push([
                        item.name ?? "",
                        item.description ?? "",
                        item.quantity ?? 0,
                        item.unitPrice ?? 0,
                        item.total ?? 0,
                    ]);
                }
                rows.push([], ["Subtotal", details.subTotal ?? ""], ["Total", details.totalAmount ?? ""]);
                const worksheet = xlsxUtils.aoa_to_sheet(rows);
                const workbook = xlsxUtils.book_new();
                xlsxUtils.book_append_sheet(workbook, worksheet, "Invoice");
                const bytes = xlsxWrite(workbook, { bookType: "xlsx", type: "array" });
                return new NextResponse(new Uint8Array(bytes), {
                    headers: {
                        "Content-Type":
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Content-Disposition": "attachment; filename=invoice.xlsx",
                    },
                    status: 200,
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
