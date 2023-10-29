import { NextRequest } from "next/server";

// JSON2CSV
import { AsyncParser } from "@json2csv/node";

// Types
import { ExportTypes } from "@/app/types/types";

export async function POST(req: NextRequest, res: Response) {
    const format = req.nextUrl.searchParams.get("format");

    const body = await req.json();

    const jsonData = JSON.stringify(body);

    try {
        switch (format) {
            case ExportTypes.JSON:
                return new Response(jsonData, {
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Disposition":
                            "attachment; filename=invoice.json",
                    },
                    status: 200,
                });
            case ExportTypes.CSV:
                console.log("DATA", body);

                //? Can pass specific fields to async parser. Empty = All
                const parser = new AsyncParser();
                const csv = await parser.parse(body).promise();

                console.log(csv);
                return new Response(csv, {
                    headers: {
                        "Content-Type": "text/csv",
                        "Content-Disposition":
                            "attachment; filename=invoice.csv",
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
