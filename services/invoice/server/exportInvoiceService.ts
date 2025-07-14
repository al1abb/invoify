import { NextRequest, NextResponse } from "next/server";

// JSON2CSV
import { AsyncParser } from "@json2csv/node";

// XML2JS
import { Builder } from "xml2js";

// XLSX
import ExcelJS from "exceljs";

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
            "Content-Disposition": "attachment; filename=invoice.json",
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
            "Content-Disposition": "attachment; filename=invoice.csv",
          },
        });
      case ExportTypes.XML:
        // Convert JSON to XML
        const builder = new Builder();
        const xml = builder.buildObject(body);
        return new NextResponse(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Content-Disposition": "attachment; filename=invoice.xml",
          },
        });
      case ExportTypes.XLSX:
        const flattenedData = flattenObject(body);

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("invoice-worksheet");

        // Add header row
        worksheet.columns = Object.keys(flattenedData).map((key) => ({
          header: key,
          key,
        }));
        // Add data row
        worksheet.addRow(flattenedData);

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();

        return new NextResponse(buffer, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=invoice.xlsx",
          },
        });
    }
  } catch (error) {
    console.error(error);

    // Return an error response
    return new Response(`Error exporting: \n${error}`, {
      status: 500,
    });
  }
}
