// Client-only PDF generation using html2pdf.js
// Note: html2pdf.js runs in the browser and cannot be executed on the server.

type Html2PdfOptions = {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: { type?: 'jpeg' | 'png' | 'webp'; quality?: number };
    html2canvas?: Record<string, unknown>;
    jsPDF?: { unit?: string; format?: string | [number, number]; orientation?: 'portrait' | 'landscape' };
    pagebreak?: {
        mode?: 'avoid-all' | 'css' | 'legacy' | Array<'avoid-all' | 'css' | 'legacy'>;
        before?: string | string[];
        after?: string | string[];
        avoid?: string | string[];
    };
};

/**
 * Generate a PDF of a DOM element using html2pdf.js (client-side only).
 *
 * @param element The DOM element to render into the PDF
 * @param filename Output filename (e.g., invoice.pdf)
 * @param options Optional html2pdf options to override defaults
 */
export async function generateHtml2Pdf(
    element: HTMLElement,
    filename: string = 'invoice.pdf',
    options: Html2PdfOptions = {}
) {
    if (typeof window === 'undefined') {
        throw new Error('generateHtml2Pdf must be called in the browser.');
    }

    // Dynamic import to avoid SSR issues
    const html2pdfModule: any = await import('html2pdf.js');
    const html2pdf = (html2pdfModule?.default || html2pdfModule);

    const defaultOptions: Html2PdfOptions = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        // Try to respect CSS breaks and avoid splitting elements like table rows
        pagebreak: { mode: ['css', 'legacy', 'avoid-all'] },
    };

    const finalOptions: Html2PdfOptions = {
        ...defaultOptions,
        ...options,
        filename: options.filename || filename,
    };

    // Execute html2pdf chain
    return html2pdf()
        .set(finalOptions)
        .from(element)
        .save();
}

/**
 * Convenience helper to generate a PDF from a selector. Throws if selector not found.
 */
export async function generateHtml2PdfFromSelector(
    selector: string,
    filename: string = 'invoice.pdf',
    options: Html2PdfOptions = {}
) {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (!element) {
        throw new Error(`Element not found for selector: ${selector}`);
    }
    return generateHtml2Pdf(element, filename, options);
}



