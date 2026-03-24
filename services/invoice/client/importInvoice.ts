import { InvoiceType } from "@/types";
import * as XLSX from "xlsx";
import { parseStringPromise } from "xml2js";

/**
 * Unflatten an object that was flattened with dot notation
 * Example: { "sender_name": "John", "sender_email": "john@example.com" }
 * becomes: { sender: { name: "John", email: "john@example.com" } }
 */
function unflattenObject(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
        const keys = key.split("_");
        let current = result;

        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!current[k]) {
                current[k] = {};
            }
            current = current[k];
        }

        current[keys[keys.length - 1]] = obj[key];
    }

    return result;
}

/**
 * Parse a JSON file and return the invoice data
 */
async function parseJsonFile(file: File): Promise<InvoiceType> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                resolve(data as InvoiceType);
            } catch (error) {
                reject(new Error("Failed to parse JSON file"));
            }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
}

/**
 * Simple CSV parser that converts CSV to an object
 * Handles quoted values and commas within quotes
 */
function parseCSV(csvText: string): Record<string, any> {
    const lines = csvText.split("\n");
    if (lines.length < 2) {
        throw new Error("CSV file must have at least headers and one data row");
    }

    const headers = parseCSVLine(lines[0]);
    const dataLine = parseCSVLine(lines[1]);

    const result: Record<string, any> = {};
    headers.forEach((header, index) => {
        result[header] = dataLine[index] || "";
    });

    return result;
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

/**
 * Parse a CSV file and return the invoice data
 */
async function parseCSVFile(file: File): Promise<InvoiceType> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csvText = event.target?.result as string;
                const firstRow = parseCSV(csvText);
                const unflattened = unflattenObject(firstRow);
                resolve(unflattened as InvoiceType);
            } catch (error) {
                reject(
                    error instanceof Error
                        ? error
                        : new Error("Failed to parse CSV file")
                );
            }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
}

/**
 * Parse an XML file and return the invoice data
 */
async function parseXMLFile(file: File): Promise<InvoiceType> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const xmlText = event.target?.result as string;
                const parsedXml = await parseStringPromise(xmlText);

                // The xml2js parser wraps the root element, we need to extract it
                // Assuming the root element is the invoice data
                const invoiceKey = Object.keys(parsedXml)[0];
                const invoiceData = parsedXml[invoiceKey];

                // Convert all array values to single values (xml2js default behavior)
                const cleanData = cleanXMLData(invoiceData);
                resolve(cleanData as InvoiceType);
            } catch (error) {
                reject(new Error("Failed to parse XML file"));
            }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
}

/**
 * Clean XML parsed data by converting arrays to values
 */
function cleanXMLData(obj: any): any {
    if (Array.isArray(obj)) {
        if (obj.length === 1) {
            return cleanXMLData(obj[0]);
        }
        return obj.map((item) => cleanXMLData(item));
    } else if (typeof obj === "object" && obj !== null) {
        const result: Record<string, any> = {};
        for (const key in obj) {
            result[key] = cleanXMLData(obj[key]);
        }
        return result;
    }
    return obj;
}

/**
 * Parse an XLSX file and return the invoice data
 */
async function parseXLSXFile(file: File): Promise<InvoiceType> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });

                // Get the first sheet
                const sheetName = workbook.SheetNames[0];
                if (!sheetName) {
                    reject(new Error("XLSX file has no sheets"));
                    return;
                }

                const worksheet = workbook.Sheets[sheetName];
                // Parse the first row (header and data combined)
                const json = XLSX.utils.sheet_to_json(worksheet);

                if (json.length === 0) {
                    reject(new Error("XLSX sheet is empty"));
                    return;
                }

                // Take the first row and unflatten it
                const firstRow = json[0] as Record<string, any>;
                const unflattened = unflattenObject(firstRow);
                resolve(unflattened as InvoiceType);
            } catch (error) {
                reject(new Error("Failed to parse XLSX file"));
            }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Parse an imported file based on its extension and return the invoice data
 * Supports: JSON, CSV, XML, XLS, XLSX
 */
export async function parseImportedFile(file: File): Promise<InvoiceType> {
    const fileName = file.name.toLowerCase();
    const extension = fileName.split(".").pop() || "";

    try {
        switch (extension) {
            case "json":
                return await parseJsonFile(file);
            case "csv":
                return await parseCSVFile(file);
            case "xml":
                return await parseXMLFile(file);
            case "xlsx":
            case "xls":
                return await parseXLSXFile(file);
            default:
                throw new Error(
                    `Unsupported file format: .${extension}. Supported formats: JSON, CSV, XML, XLS, XLSX`
                );
        }
    } catch (error) {
        throw error instanceof Error
            ? error
            : new Error("Unknown error while parsing file");
    }
}
