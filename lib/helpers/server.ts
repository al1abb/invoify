import { NextResponse } from "next/server";

/**
 * Dynamically import invoice template by id.
 */
export const getInvoiceTemplate = async (templateId: number) => {
  const componentName = `InvoiceTemplate${templateId}`;

  try {
    const module = await import(
      `@/app/components/templates/invoice-pdf/${componentName}`
    );
    return module.default;
  } catch (err) {
    console.error(`Error importing template ${componentName}: ${err}`);
    return null;
  }
};

/**
 * Convert a file to a Node Buffer.
 */
export const fileToBuffer = async (file: File) => {
  const arrayBuffer = await new NextResponse(file).arrayBuffer();
  return Buffer.from(arrayBuffer);
};
