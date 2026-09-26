import { NextRequest, NextResponse } from "next/server";

// JSON2CSV
import { AsyncParser } from "@json2csv/node";

// XML2JS
import { Builder } from "xml2js";

// Validation
import { InvoiceSchema } from "@/lib/schemas";
import { parseJsonBody } from "@/lib/server/validateRequest";

// XRechnung
import {
    buildXRechnungUBL,
    XRechnungError,
    InvoiceInputError,
} from "@conformo/formats";
import { toConformoInvoice, XRechnungMappingError } from "./xrechnungMapper";

// Types
import { ExportTypes } from "@/types";

/**
 * Export an invoice in selected format.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} A response object containing the exported data in the requested format.
 */
export async function exportInvoiceService(req: NextRequest) {
    const format = req.nextUrl.searchParams.get("format");

    /*
     * The parsed body is handed to xml2js and json2csv, both of which walk the
     * whole structure. Validating first means they only ever see an
     * invoice-shaped object, rather than arbitrary deeply-nested JSON.
     */
    const parsed = await parseJsonBody(req, InvoiceSchema);
    if (!parsed.ok) return parsed.response;

    const body = parsed.data;

    try {
        switch (format) {
            case ExportTypes.JSON: {
                const jsonData = JSON.stringify(body);
                return new NextResponse(jsonData, {
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Disposition":
                            "attachment; filename=invoice.json",
                    },
                    status: 200,
                });
            }
            case ExportTypes.CSV: {
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
            }
            case ExportTypes.XML: {
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
            }
            case ExportTypes.XRECHNUNG: {
                /*
                 * XRechnung 3.0, UBL syntax — the German B2G e-invoice
                 * standard (see @conformo/formats on npm). This is a
                 * best-effort mapping from invoify's existing fields (see
                 * xrechnungMapper.ts for exactly what's assumed and what's
                 * not collected yet, e.g. a seller VAT ID). Both mapping
                 * gaps and XRechnung's own mandatory-field checks come back
                 * as a normal 400 with the specific missing term named,
                 * not a generic failure.
                 */
                try {
                    const invoice = toConformoInvoice(body);
                    const ubl = buildXRechnungUBL(invoice);
                    return new NextResponse(ubl, {
                        headers: {
                            "Content-Type": "application/xml",
                            "Content-Disposition":
                                "attachment; filename=invoice-xrechnung.xml",
                        },
                    });
                } catch (error) {
                    if (
                        error instanceof XRechnungError ||
                        error instanceof XRechnungMappingError ||
                        error instanceof InvoiceInputError
                    ) {
                        return NextResponse.json(
                            { error: error.message },
                            { status: 400 }
                        );
                    }
                    throw error;
                }
            }
            /*
             * ExportTypes.XLSX is intentionally unimplemented. The original
             * case was commented out, so the UI's "Export as XLSX" button only
             * ever errored; that button has been removed rather than left
             * broken. Restoring it needs a spreadsheet library — note the
             * `xlsx` package was dropped here because the 0.18.5 line on npm
             * carries unpatched advisories and SheetJS now publishes from its
             * own registry.
             */
            default:
                /*
                 * Previously absent: an unknown format fell out of the switch
                 * and returned undefined, which Next surfaces as an opaque
                 * "no response returned" 500 rather than a usable error.
                 */
                return NextResponse.json(
                    { error: `Unsupported export format: ${format ?? "none"}` },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Export error:", error);

        return NextResponse.json(
            { error: "Failed to export invoice" },
            { status: 500 }
        );
    }
}
